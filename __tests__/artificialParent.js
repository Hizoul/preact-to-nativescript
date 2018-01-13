import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

test("Basic Render", () => {
  const rendered = preactToNativeScript.render(h("page"))
  const cssFileString = "mycssfile"
  let touchedString = "unotuched"
  expect(cssFileString).not.toBe(touchedString)
  const obj = {
    text: "Hi",
    cssFile: "mycssfile",
    addCssFile: (a) => {
      touchedString = a
    }
  }
  expect(rendered).toMatchSnapshot("after render")
  rendered.parentNode.appendChild(obj)
  expect(cssFileString).toBe(touchedString)
  expect(rendered).toMatchSnapshot("after append child")
  rendered.parentNode.removeChild(obj)
  expect(rendered).toMatchSnapshot("after remove child")
  rendered.parentNode.remove()
  expect(rendered).toMatchSnapshot("after parent remove")
})
