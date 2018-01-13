import * as preactToNativeScript from "../index"

const h = preactToNativeScript.Preact.h

class SegmentedBar extends preactToNativeScript.Preact.Component {
  render() {
    const show = this.state ? this.state.show : false
    const segmentChildren = [h("tabViewItem", {title: "bla"}, [h("stackLayout", null, [h("label", "tab1")])])]
    segmentChildren.push(h("tabViewItem", {title: "asdf"}, [h("stackLayout", null, [h("label", "tab2")])]))
    if (show) {
      segmentChildren.push(h("tabViewItem", {title: "hasdf"}, [h("stackLayout", null, [h("label", "tabx1")])]))
    }
    segmentChildren.push(h("tabViewItem", {title: "uztriurtzui"}, [h("stackLayout", null, [h("label", "tab3")])]))
    if (show) {
      segmentChildren.push(h("tabViewItem", {title: "mbvcm"}, [h("stackLayout", null, [h("label", "tabx2")])]))
    }
    segmentChildren.push(h("tabViewItem", {title: "97634"}, [h("stackLayout", null, [h("label", "tab3")])]))
    if (show) {
      segmentChildren.push(h("tabViewItem", {title: "123465"}, [h("stackLayout", null, [h("label", "tabx4")])]))
    }
    return h("page", {updateState: this.setState}, [
      h("stackLayout", null, [
        h("tabView", null, segmentChildren)
      ])
    ])
  }
}

test("TabView", () => {
  let vnode = h(SegmentedBar)
  let resultingRender = preactToNativeScript.render(vnode)
  expect(resultingRender).toMatchSnapshot("Render of TabView")
  resultingRender._component.setState({show: true})
  resultingRender = preactToNativeScript.render(vnode, resultingRender.parentNode, resultingRender)
  expect(resultingRender).toMatchSnapshot("Render of changed TabView")
})
