# Vanilla JavaScript
The [quick-start](quickstart.md) example uses the plain javascript  [React.createElement / preact.h](https://hackernoon.com/understanding-the-react-source-code-initial-rendering-simple-component-i-80263fe46cf1) syntax.

The following is a list of accepted component names, sorted just like the NativeScript cookbook navigation and also linkng there.
- Layouts
  - [absoluteLayout](https://docs.nativescript.org/cookbook/ui/layouts/absolute-layout)
  - [dockLayout](https://docs.nativescript.org/cookbook/ui/layouts/dock-layout)
  - [flexboxLayout](https://docs.nativescript.org/cookbook/ui/layouts/flexbox-layout)
  - [gridLayout](https://docs.nativescript.org/cookbook/ui/layouts/grid-layout)
  - [stackLayout](https://docs.nativescript.org/cookbook/ui/layouts/stack-layout)
  - [wrapLayout](https://docs.nativescript.org/cookbook/ui/layouts/wrap-layout)
- [actionBar / actionItem / navigationButton](https://docs.nativescript.org/cookbook/ui/action-bar)
- [activityIndicator](https://docs.nativescript.org/cookbook/ui/activity-indicator)
- [button](https://docs.nativescript.org/cookbook/ui/button)
- [datePicker](https://docs.nativescript.org/cookbook/ui/date-picker)
- [htmlView](https://docs.nativescript.org/cookbook/ui/html-view)
- [image](https://docs.nativescript.org/cookbook/ui/image)
- [label](https://docs.nativescript.org/cookbook/ui/label)
- [listPicker](https://docs.nativescript.org/cookbook/ui/list-picker)
- [listView](https://docs.nativescript.org/cookbook/ui/list-view)
- [page](https://docs.nativescript.org/cookbook/ui/page)
- [placeholder](https://docs.nativescript.org/cookbook/ui/placeholder)
- [progress](https://docs.nativescript.org/cookbook/ui/progress)
- [scrollView](https://docs.nativescript.org/cookbook/ui/scroll-view)
- [searchBar](https://docs.nativescript.org/cookbook/ui/search-bar)
- [segmentedBar](https://docs.nativescript.org/cookbook/ui/segmented-bar)
- [slider](https://docs.nativescript.org/cookbook/ui/slider)
- [switch](https://docs.nativescript.org/cookbook/ui/switch)
- [tabView / tabViewItem](https://docs.nativescript.org/cookbook/ui/tab-view)
- [textField](https://docs.nativescript.org/cookbook/ui/text-field)
- [textView](https://docs.nativescript.org/cookbook/ui/text-view)
- [timePicker](https://docs.nativescript.org/cookbook/ui/time-picker)
- [webView](https://docs.nativescript.org/cookbook/ui/web-view)

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