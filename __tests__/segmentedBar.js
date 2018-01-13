import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

class SegmentedBar extends preactToNativeScript.Preact.Component {
  render() {
    const show = this.state ? this.state.show : false
    const segmentChildren = [h("segmentedBarItem", {title: "bla"})]
    segmentChildren.push(h("segmentedBarItem", {title: "asdf"}))
    if (show) {
      segmentChildren.push(h("segmentedBarItem", {title: "hasdf"}))
    }
    segmentChildren.push(h("segmentedBarItem", {title: "uztriurtzui"}))
    if (show) {
      segmentChildren.push(h("segmentedBarItem", {title: "mbvcm"}))
    }
    segmentChildren.push(h("segmentedBarItem", {title: "97634"}))
    if (show) {
      segmentChildren.push(h("segmentedBarItem", {title: "123465"}))
    }
    return h("page", {updateState: this.setState}, [
      h("stackLayout", null, [
        h("segmentedBar", null, segmentChildren)
      ])
    ])
  }
}

test("SegmentedBar", () => {
  let vnode = h(SegmentedBar)
  let resultingRender = preactToNativeScript.render(vnode)
  expect(resultingRender).toMatchSnapshot("Render of SegmentedBar")
  resultingRender._component.setState({show: true})
  resultingRender = preactToNativeScript.render(vnode, resultingRender.parentNode, resultingRender)
  expect(resultingRender).toMatchSnapshot("Render of changed SegmentedBar")
})
