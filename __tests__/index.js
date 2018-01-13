import * as preactToNativeScript from "../index"

const nodeValueGetSet = preactToNativeScript.nodeValueGetSet

const h = preactToNativeScript.Preact.h

test("Basic Render", () => {
  expect(preactToNativeScript.render(
    h("page", null, [
      h("scrollView", null, [
        h("stackLayout", null, [
          h("label", {text: "myText"})
        ])
      ])
    ])
  )).toMatchSnapshot("basic renderA")
})

test("nodeValueGetSet", () => {
  const Cl = () => {
    return this
  }
  const instance = new Cl()
  Object.defineProperty(instance, "nodeValue", nodeValueGetSet)
  expect(instance.text).toBe(undefined)
  instance.nodeValue = "new"
  expect(instance.text).toBe("new")
})