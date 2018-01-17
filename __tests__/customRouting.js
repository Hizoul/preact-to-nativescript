import { render, h, Component, goBack } from "../index"

class Route1 extends Component {
  render() {
    return h("stackLayout", null, [
      h("label", {text: "First Page"}),
      h("button", {text: "Go to Second", onTap: this.props.navigateTo.bind(this, "/test")}),
      h("label", {text: "Go Back within custom router", onTap: this.props.goBack}),
      h("button", {text: "Go Back in NativeScript Router", onTap: goBack})
    ])
  }
}

class Route2 extends Component {
  render() {
    return h("stackLayout", null, [
      h("label", {text: "Second Page"}),
      h("button", {text: "Go to First", onTap: this.props.navigateTo.bind(this, "/test")}),
      h("label", {text: "Go Back within custom router", onTap: this.props.goBack}),
      h("button", {text: "Go Back in NativeScript Router", onTap: goBack})
    ])
  }
}

const routes = [
  {default: true, path: "/", component: Route1},
  {path: "/test", component: Route2}
]

class PageCustomRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: "/",
      navStack: []
    }
    this.setNav = (newRoute) => {
      const newStack = this.state.navStack.splice()
      newStack.push(newRoute)
      this.setState({route: newRoute, navStack: newStack})
    }
    this.goBack = () => {
      if (this.state.navStack.length > 1) {
        const newStack = this.state.navStack.splice()
        newStack.pop()
        this.setState({route: newStack[newStack.length - 1], navStack: newStack})
      }
    }
  }
  render() {
    let Comp = h("stackLayout")
    for (const route of routes) {
      if (this.state.route === route.path) {
        Comp = route.component
      }
    }
    return h("page", null, [h(Comp, {navigateTo: this.setNav, goBack: this.goBack})])
  }
}

class ChildChange extends Component {
  render() {
    const children = this.state.changed
      ? [
        h("stackLayout", null, [
          h("label", {text: "changed Label #1"}),
          h("button", {text: "changed Button #1"}),
          h("label", {text: "changed Label #2"}),
          h("button", {text: "changed Button #2"})
        ])
      ]
      : [
        h("stackLayout", null, [
          h("label", {text: "WE ARE UNCHANGED"}),
          h("button", {text: "SO VERY UNCHANGED"}),
          h("label", {text: "MORE UNCHANGED"}),
          h("button", {text: "THAN YOU ARE"})
        ])
      ]
    return h("page", null, children)
  }
}

test("Verify children for custom-router demo page get properly removed", () => {
  expect(true).toBe(true)
  const vnode = h(ChildChange)
  let resultingRender = render(vnode)
  expect(resultingRender).toMatchSnapshot("Unchanged")
  resultingRender._component.setState({changed: true})
  resultingRender._component.forceUpdate()
  expect(resultingRender).toMatchSnapshot("Changed")
  resultingRender._component.setState({changed: true})
  resultingRender._component.forceUpdate()
  expect(resultingRender).toMatchSnapshot("reset to unchanged again")
})

test("Verify children for actual custom-router demo page get properly removed", () => {
  expect(true).toBe(true)
  const vnode = h(PageCustomRouter)
  let resultingRender = render(vnode)
  expect(resultingRender).toMatchSnapshot("Unchanged")
  resultingRender._component.setNav("/test")
  resultingRender._component.forceUpdate()
  expect(resultingRender).toMatchSnapshot("Changed")
  resultingRender._component.goBack()
  resultingRender._component.forceUpdate()
  expect(resultingRender).toMatchSnapshot("reset to unchanged again")
  resultingRender._component.setNav("/test")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/test")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/test")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/")
  resultingRender._component.forceUpdate()
  resultingRender._component.setNav("/test")
  resultingRender._component.forceUpdate()
  expect(resultingRender).toMatchSnapshot("after various changes")
})
