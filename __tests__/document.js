import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

test("Test Element insertBefore / replaceWith", () => {
  const rendered = preactToNativeScript.render(
    h("page", null, [
      h("scrollView", null, [
        h("stackLayout", null, [
          h("label", {text: "myText"})
        ])
      ])
    ])
  )
  const newChild = preactToNativeScript.render(h("label", {text: "myText"}))
  const newChild2 = preactToNativeScript.render(h("label", {text: "myText"}))
  const newChild3 = preactToNativeScript.render(h("label", {text: "myText"}))
  expect(rendered.childNodes).toMatchSnapshot("children after regular render")
  rendered.replaceChild(newChild, rendered.childNodes[0])
  expect(rendered.childNodes).toMatchSnapshot("children after replace child")
  rendered.insertBefore(newChild2, null)
  expect(rendered.childNodes).toMatchSnapshot("children after insertBefore without ref")
  rendered.insertBefore(newChild3, newChild2)
  expect(rendered.childNodes).toMatchSnapshot("children after insertBefore with valid ref")
  rendered.text = "mytext"
  rendered.appendChild({nodeValue: "myNewText", splitText: ""})
  expect(rendered.text).toBe("myNewText")
  expect(rendered.asdf).toBe(undefined)
  rendered.setAttributeNS(null, "asdf", "myAsdfVal")
  expect(rendered.asdf).toBe("myAsdfVal")
  expect(rendered.asdf).toBe(rendered.getAttributeNS(null, "asdf"))
  rendered.removeAttributeNS(null, "asdf")
  expect(rendered.asdf).toBe(undefined)
  expect(rendered.bla).toBe(undefined)
  rendered.setAttribute("bla", "blu")
  expect(rendered.bla).toBe("blu")
  expect(rendered.bla).toBe(rendered.getAttribute("bla"))
  rendered.removeAttribute("bla")
  expect(rendered.bla).toBe(null)
})
