import * as preactToNativeScript from "../index"

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
