import * as preactToNativeScript from "../index"

const nodeValueGetSet = preactToNativeScript.nodeValueGetSet

const h = preactToNativeScript.Preact.h

test("Basic Render", () => {
  const rendered = preactToNativeScript.render(
    h("page", null, [
      h("scrollView", null, [
        h("stackLayout", null, [
          h("label", {text: "myText"})
        ])
      ])
    ])
  )
  expect(rendered).toMatchSnapshot("basic renderA")
  const child = rendered.childNodes[0]
  child.remove()
  child.splitText = ""
  child.text = "myText"
  child.removeChild(child)
  rendered.remove()
  expect(rendered).toMatchSnapshot("after remove")
  let calledRemoveChild = false
  let calledRemoveView = false
  rendered.nodeName = "np"
  rendered.removeChild = () => {
    calledRemoveChild = true
  }
  rendered.callRemoveChild({
    nodeName: "ac"
  })
  expect(calledRemoveChild).toBeTruthy()
  rendered.removeChild = null
  rendered._removeView = () => {
    calledRemoveView = true
  }
  rendered.callRemoveChild({
    nodeName: "ac2"
  })
  expect(calledRemoveView).toBeTruthy()
  rendered.content = "mycontent"
  rendered.nodeName = "SCROLLVIEW"
  rendered.callRemoveChild({nodeName: "bla"})
  expect(rendered.content).toBe(null)
  rendered.actionView = "mycontent"
  rendered.nodeName = "ACTIONITEM"
  rendered.callRemoveChild({nodeName: "bla"})
  expect(rendered.actionView).toBe(null)
  rendered.actionView = "mycontent"
  rendered.nodeName = "NAVIGATIONBUTTON"
  rendered.callRemoveChild({nodeName: "bla"})
  expect(rendered.actionView).toBe(null)
  rendered.nodeName = "ACTIONBAR"
  const c1 = {nodeName: "ACTIONITEM"}
  let removeItemCalled = false
  rendered.actionItems = {removeItem: () => removeItemCalled = true}
  rendered.callRemoveChild(c1)
  expect(removeItemCalled).toBeTruthy()
  const nb = {nodeName: "NAVIGATIONBUTTON"}
  rendered.navigationButton = nb
  rendered.callRemoveChild(nb)
  expect(rendered.navigationButton).toBe(null)
  rendered.titleView = "myview"
  rendered.callRemoveChild({nodeName: ""})
  expect(rendered.titleView).toBe(null)
  const actionBar = {nodeName: "ACTIONBAR"}
  rendered.actionBar = actionBar
  rendered.nodeName = "PAGE"
  rendered.callRemoveChild(actionBar)
  expect(rendered.actionBar).toBe(null)
  rendered.nodeName = "SEGMENTEDBAR"
  rendered.items = "bla"
  rendered.callRemoveChild()
  expect(rendered.items).toEqual(rendered.childNodes)
})

test("nodeValueGetSet", () => {
  const Cl = () => {
    return this
  }
  const instance = new Cl()
  Object.defineProperty(instance, "nodeValue", nodeValueGetSet)
  expect(instance.text).toBe(undefined)
  instance.nodeValue = "new"
  expect(instance.nodeValue).toBe("new")
  expect(instance.text).toBe("new")

  const element = global.document.createElement("page")
  element.addChild(global.document.createElement("stackLayout"))
  expect(element.lastChild).toMatchSnapshot("last child")
  expect(element.firstChild).toMatchSnapshot("first child")
  expect(global.document.createElement("undefined")).toMatchSnapshot("expectation for undefined creation")
  element.parentNode = {
    childNodes: [
      {nodeName: "diff"}, element, {nodeName: "erent"}
    ]
  }
  expect(element.previousSibling).toMatchSnapshot("previous sibling")
  expect(element.nextSibling).toMatchSnapshot("next sibling")
})
