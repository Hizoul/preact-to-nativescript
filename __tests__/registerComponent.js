import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

class MyComp {
  constructor() {
    this._eventListener = []
  }
  addChild() {
  }
  removeChild() {
  }
  _removeView() {
    
  }
  addEventListener(name, func, node) {
    this._eventListener[name] = func
  }
  removeEventListener(name, func, node) {
    this._eventListener[name] = null
  }
}

test("SegmentedBar", () => {
  const vnode = h("page", null, [
    h("stackLayout", null, [
      h("gradient")
    ])
  ])
  try {
  expect(preactToNativeScript.render(vnode)).toMatchSnapshot("before registered gradient")
  } catch (e) {
    expect(e).toMatchSnapshot("err")
  }
  preactToNativeScript.registerComponent("gradient", MyComp)
  expect(preactToNativeScript.render(vnode)).toMatchSnapshot("after registered gradient")
})
