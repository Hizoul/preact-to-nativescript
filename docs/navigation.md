# JavaScript Navigation
Using JavaScript navigation by changing the rendered component via state changes works without a hitch.
This is an example custom router implementation findable in the demo application.
```typescript
import { Component } from "preact"
import {
  Button, HtmlView, Label, Page, ScrollView, StackLayout, TextView, WebView
} from "preact-nativescript-components"
import { goBack, h } from "preact-to-nativescript"

class Route1 extends Component<any, any> {
  public render() {
    return (
      <StackLayout>
        <Label text="First Page" />
        <Button onTap={this.props.navigateTo.bind(this, "/")} />
        <Button onTap={this.props.goBack} />
      </StackLayout>
    )
  }
}

class Route2 extends Component<any, any> {
  public render() {
    return (
      <StackLayout>
        <Label text="Second Page" />
        <Button onTap={this.props.navigateTo.bind(this, "/")} />
        <Button onTap={this.props.goBack} />
      </StackLayout>
    )
  }
}

const routes = [
  {default: true, path: "/", component: Route1},
  {path: "/test", component: Route2}
]

class PageCustomRouter extends Component<any, any> {
  private setNav: Function
  private goBack: Function
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
      const newStack = this.state.navStack.splice()
      newStack.pop()
      this.setState({route: newStack[newStack.length - 1], navStack: newStack})
    }
  }
  public render() {
    let Comp: any = StackLayout
    for (const route of routes) {
      if (this.state.route === route.path) {
        Comp = route.component
      }
    }
    return (
      <Page>
        <Comp navigateTo={this.setNav} goBack={this.goBack} />
      </Page>
    )
  }
}

export default PageCustomRouter

```

## Native Navigation

NativeScript does offer an API to navigate that supports animations etc. out of the box.
preact-to-nativescript does not yet correctly unmount pages when you use goBack! Contributions to fix that are welcome!
This API is usable as portrayed below.
```typescript
import { FunctionalComponent } from "preact"
import { ActionBar, Button, Label, Page, ScrollView, StackLayout } from "preact-nativescript-components"
import { h, navigateTo } from "preact-to-nativescript"
import PageActionBar from "./actionBar"
import PageActivityIndicator from "./activityIndicator"
import PageHtmlView from "./htmlView"

const StartPage: FunctionalComponent<any> = () => {
  return (
    <Page>
        <ActionBar text="Preact to Nativescript Menu" />
        <ScrollView>
          <StackLayout>
            <Button text="ActivityIndicator" onTap={navigateTo.bind(null, <PageActivityIndicator />)} />
            <Button text="ActionBar" onTap={navigateTo.bind(null, <PageActionBar />)} />
            <Button text="ActionBar" onTap={navigateTo.bind(null, <PageHtmlView />)} />
          </StackLayout>
        </ScrollView>
    </Page>
  )
}

export default StartPage
```

You could also directly call NativeScripts APIs which is what the `navigateTo` and `goBack` functions do
```javascript
const topmost = require("tns-core-modules/ui/frame").topmost()
topmost.navigate(() => require("preact-to-nativescript").render(<YourComopnent />))
topmost.goBack()
```
