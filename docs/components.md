# Vanilla JavaScript
The [quick-start](quickstart.md) example uses the plain javascript  [React.createElement / preact.h](https://hackernoon.com/understanding-the-react-source-code-initial-rendering-simple-component-i-80263fe46cf1) syntax.

The following is a list of accepted / translated component names
- page
- button
- textField
- textView
- label
- scrollView
- actionBar
- actionItem
- navigationButton
- tabView / tabViewItem
- segmentedBar / segmentedBarItem
- stackLayout / gridLayout / absoluteLayout

# JSX 
If you prefer JSX check out [preact-nativescript-components](https://github.com/hizoul/preact-nativescript-components) which makes the code look like so:
```javascript
var application = require("application")
import { render } from "preact-to-nativescript"
import { Page, ActionBar, StackLayout, Label } from "preact-nativescript-components"

application.start({
  create: () => {
    return render(
      <Page>
        <ActionBar title="Custom Title" />
        <StackLayout>
          <Label text="preact-to-nativescript page">
        </StackLayout>
      </Page>
    )
  }
})
```