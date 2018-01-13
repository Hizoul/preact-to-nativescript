// stuff to mix into NS's view prototypes
// mostly copied from Node in undom (https://github.com/developit/undom/blob/master/src/undom.js)
function findWhere(arr, fn, returnIndex, byValueOnly) {
  let i = arr.length
  while (i--) if (typeof fn === "function" && !byValueOnly ? fn(arr[i]) : arr[i] === fn) break
  return returnIndex ? i : arr[i]
}
let extensions = {
  setAttribute(name, value) {
    this.set(name, value)
  },
  getAttribute(name) {
    return this[name]
  },
  removeAttribute(name) {
    this.set(name, null)
  },
  getAttributeNS(ignored, name, value) {
    return this[name]
  },
  setAttributeNS(ignored, name, value) {
    this.set(name, value)
  },
  removeAttributeNS(name) {
    delete this[name]
  },
  // Wrapper because some NativeScript Elements don't have addChild
  callAddChild(child, offset) {
    if (this.nodeName === "SEGMENTEDBAR" || this.nodeName === "TABVIEW") {
      this.items = this.childNodes.slice(0)
    } else if (this.nodeName === "TABVIEWITEM") {
      this.view = child
    } else if (this.nodeName === "PAGE") {
      if (child.nodeName === "ACTIONBAR") {
        this.actionBar = child
      } else {
        this.content = child
      }
    } else if (this.nodeName === "ACTIONBAR") {
      if (child.nodeName === "ACTIONITEM") {
        this.actionItems.addItem(child)
      } else if (child.nodeName === "NAVIGATIONBUTTON") {
        this.navigationButton = child
      } else {
        this.titleView = child
      }
    } else if (this.nodeName === "ACTIONITEM" || this.nodeName === "NAVIGATIONBUTTON") {
      this.actionView = child
    } else if (this.nodeName === "SCROLLVIEW") {
      this.content = child
    } else {
      this.addChild(child, offset)
    }
  },
  appendChild(child) {
    if ("text" in this && child.splitText !== null) {
      this.text = child.nodeValue
    } else {
      this.childNodes.push(child)
      child.parentNode = this
    }
    this.callAddChild(child)
  },
  insertBefore(child, ref) {
    child.remove()
    // find the index at which to insert the child based on ref:
    let offset = this.childNodes.indexOf(ref)
    child.parentNode = this
    if (offset !== undefined && offset !== null) {
      this.childNodes.splice(offset, 0, child)
      this.callAddChild(child, offset)
    } else {
      this.childNodes.push(child)
      this.callAddChild(child)
    }
  },
  replaceChild(child, ref) {
    if (ref.parentNode === this) {
      ref.remove()
      this.insertBefore(child, ref)
    }
  },
  // Wrapper because some NativeScript Elements don't have removeChild
  callRemoveChild(child) {
    if (this.nodeName === "SEGMENTEDBAR") {
      this.items = this.childNodes.slice(0)
    } else if (this.nodeName === "PAGE") {
      if (child.nodeName === "ACTIONBAR") {
        if (this.actionBar === child) {
          this.actionBar = null
        }
      } else if (this.content === child) {
        this.content = null
      }
    } else if (this.nodeName === "ACTIONBAR") {
      if (child.nodeName === "ACTIONITEM") {
        this.actionItems.removeItem(child)
      } else if (child.nodeName === "NAVIGATIONBUTTON") {
        if (this.navigationButton === child) {
          this.navigationButton = null
        }
      } else {
        this.titleView = null
      }
    } else if (this.nodeName === "ACTIONITEM" || this.nodeName === "NAVIGATIONBUTTON") {
      this.actionView = null
    } else if (this.nodeName === "SCROLLVIEW") {
      this.content = null
    } else {
      if (this.removeChild === undefined || this.removeChild === null) {
        this._removeView(child)
      } else {
        this.removeChild(child)
      }
    }
  },
  removeChild(child) {
    if ("text" in this && child.splitText !== null) {
      this.text = ""
    } else {
      const childIndex = this.childNodes.indexOf(child)
      if (childIndex !== -1) {
        this.childNodes.splice(childIndex, 1)
      }
      this.callRemoveChild(child)
    }
    child.parentNode = null
  },
  // loaded and unloaded for possible native navigation but remount not working yet
  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
      this.parentNode = null
    }
  },
  remount() {
  }
}
const isUpperCase = (inspect) => inspect === inspect.toUpperCase()

const convertType = (type) => {
  if (type.toLowerCase() === "tabviewitem") {
    return "tab-view"
  }
  if (type.toLowerCase() === "segmentedbaritem") {
    return "segmented-bar"
  }
  if (type.toLowerCase() === "actionitem" || type.toLowerCase() === "navigationbutton") {
    return "action-bar"
  }
  let newType = ""
  for (let i = 0; i < type.length; i++) {
    const char = type.charAt(i)
    newType += isUpperCase(char) ? `-${char.toLowerCase()}` : char
  }
  return newType
}

const document = {
  createElement(type) {
    if (type === "undefined") {
      type = "stackLayout"
    }
    // imports and augments NS view classes on first use
    const originalType = type
    type = type.toLowerCase()
    let NativeElement
    if (type in types) {
      NativeElement = types[type]
    } else {
      let elementRequirePath = "tns-core-modules/ui/"
      if (type.indexOf("layout") !== -1) {
        elementRequirePath += "layouts/"
      }
      elementRequirePath += convertType(originalType)
      let m = require(elementRequirePath)
      // find matching named export:
      for (let i in m) {
        if (i.toLowerCase() === type) {
          NativeElement = m[i]
          break
        }
      }
      Object.assign(NativeElement.prototype, extensions)
      Object.defineProperty(NativeElement, "firstChild", {
        get() { return this.childNodes[0] }
      })
      Object.defineProperty(NativeElement, "lastChild", {
        get() { return this.childNodes[this.childNodes.length - 1] }
      })
      Object.defineProperty(NativeElement, "nextSibling", {
        get() {
          let p = this.parentNode
          if (p) return p.childNodes[findWhere(p.childNodes, this, true) + 1]
        }
      })
      Object.defineProperty(NativeElement, "previousSibling", {
        get() {
          let p = this.parentNode
          if (p) return p.childNodes[findWhere(p.childNodes, this, true) - 1]
        }
      })
      types[type] = NativeElement
    }
    NativeElement = new NativeElement()
    NativeElement.loaded = false
    NativeElement.firstLoad = true
    NativeElement.nodeType = 1
    NativeElement.nodeName = type.toUpperCase()
    NativeElement.attributes = []
    NativeElement.childNodes = []
    NativeElement.set = (name, value) => {
      NativeElement[name] = value
    }
    return NativeElement
  },
  createTextNode(text) {
    let el = document.createElement("label")
    el.text = text
    Object.defineProperty(el, "nodeValue", {
      set(v) { this.text = v },
      get() { return this.text }
    })
    el.splitText = () => null
    return el
  }
}

global.document = document
import * as Preact from "./preact"

let types = {}
// preact-render-to-nativescript
const render = (Component, parent, merge) => {
  if (parent === undefined || parent === null) {
    parent = {
      nodeType: "artificalParent",
      nodeName: "artificalParent",
      attributes: [],
      childNodes: [],
      renderedComponent: null,
      mergeInto: null,
      renderedInto: null,
      appendChild: (newChild) => {
        if (newChild.cssFile) {
          newChild.addCssFile(newChild.cssFile)
        }
        parent.childNodes.push(newChild)
        newChild.parentNode = parent
        newChild.renderedComponent = parent.renderedComponent
        newChild.mergeInto = parent.mergeInto
      },
      removeChild: (child) => {
        const childIndex = parent.childNodes.indexOf(child)
        if (childIndex !== -1) {
          parent.childNodes.splice(childIndex, 1)
        }
      },
      remove: () => {
      }
    }
  }
  parent.renderedComponent = Component
  parent.mergeInto = merge
  const renderedInto = Preact.render(Component, parent, merge)
  for (const child of parent.childNodes) {
    child.renderedInto = renderedInto
  }
  return parent.childNodes[0]
}

export default render
export {
  Preact, render
}
