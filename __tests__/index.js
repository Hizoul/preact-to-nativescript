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
  expect(element.previousSibling).toMatchSnapshot("previous sibling")
  expect(element.nextSibling).toMatchSnapshot("next sibling")
  expect(element.lastChild).toMatchSnapshot("last child")
  expect(element.firstChild).toMatchSnapshot("first child")
  expect(global.document.createElement("undefined")).toMatchSnapshot("expectation for undefined creation")
})
