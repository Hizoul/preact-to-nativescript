# preact-to-nativescript[![Build Status](https://travis-ci.org/Hizoul/preact-to-nativescript.svg?branch=master)](https://travis-ci.org/Hizoul/preact-to-nativescript) [![Coverage Status](https://coveralls.io/repos/github/Hizoul/preact-to-nativescript/badge.svg?branch=master)](https://coveralls.io/github/Hizoul/preact-to-nativescript?branch=master) [![dependencies](https://david-dm.org/Hizoul/preact-to-nativescript.png)](https://david-dm.org/Hizoul/preact-to-nativescript) [![npm](https://img.shields.io/npm/v/preact-to-nativescript.svg)](https://www.npmjs.com/package/preact-to-nativescript)
## This Library is experimental!
## [Documentation](https://rawgit.com/Hizoul/preact-to-nativescript/master/docs/_book/index.html)

# Usage
The following is assumed to be executed at the project root of a NativeScript Project

1. Install the library
```bash
npm i preact-to-nativescript
```
2. Adjust your NativeScript app.js
```javascript
var application = require("application")
var preactToNativeScript = require("preact-to-nativescript")
var render = preactToNativeScript.render
var h = preactToNativeScript.Preact.h

application.start({
  create: () => {
    return render(h("page", {}, [h("actionBar", {title: "Custom Title"}), h("stackLayout", {}, [h("label", {text: "preact-to-nativescript page"}, [])])]))
  }
})
```
3. Run your NativeScript app

# Components
The usage example uses the plain javascript  [React.createElement / preact.h](https://hackernoon.com/understanding-the-react-source-code-initial-rendering-simple-component-i-80263fe46cf1) syntax. If you prefer JSX check out [preact-nativescript-components](https://github.com/hizoul/preact-nativescript-components) which makes the code look like so:
```typescript
import * as application from "tns-core-modules/application"
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

# TBD
- dont ship own preact version
- Handle unmounting properly when navigating via Nativescripts API (custom routing in pure js works fine though!)
- ActionBar Known Limitations
  - SystemIcon is not respected
  - NavigationButton doesn't properly render

# Credits
- [developit](https://github.com/developit) by providing [this untested document implementation](https://github.com/staydecent/nativescript-preact/issues/4#issuecomment-323900569) that turned into the core of this library. He also authored [undom](https://github.com/developit/undom) from which some document mock code was borrowed. And he also authored [preact](https://github.com/developit/preact) without which this wouldn't even be possible.
- [staydecent](https://github.com/staydecent) for providing [a code example](https://github.com/staydecent/nativescript-preact) that showed that preact-to-nativescript is not impossible wizardry but achievable by writing the right wrapper