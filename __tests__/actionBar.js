import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

test("Action Bar", () => {
  expect(true).toBe(true)
  const resultingRender = preactToNativeScript.render(
    h("page", null, [
      h("actionBar", null, [
        h("stackLayout", null, [
          h("label", {text: "myText"})
        ]),
        h("navigationButton", {text: "MyNav"}, [h("label", {}, ["rawtext", "as", "children"])]),
        h("actionItem", {text: "myAction"}),
        h("actionItem", {text: "otherAction"}, [h("label", {text: "ot"})])
      ]),
      h("scrollView", null, [
        h("stackLayout", null, [
          h("label", {text: "myText"})
        ])
      ])
    ])
  )
  expect(resultingRender).toMatchSnapshot("Render of ActionBar")
})
