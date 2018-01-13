# preact-to-nativescript[![Build Status](https://travis-ci.org/Hizoul/preact-to-nativescript.svg?branch=master)](https://travis-ci.org/Hizoul/preact-to-nativescript) [![Coverage Status](https://coveralls.io/repos/github/Hizoul/preact-to-nativescript/badge.svg?branch=master)](https://coveralls.io/github/Hizoul/preact-to-nativescript?branch=master) [![dependencies](https://david-dm.org/Hizoul/preact-to-nativescript.png)](https://david-dm.org/Hizoul/preact-to-nativescript) [![npm](https://img.shields.io/npm/v/preact-to-nativescript.svg)](https://www.npmjs.com/package/preact-to-nativescript)
## This Library is experimental!

# Usage
The following is assumed to be executed at the project root of a NativeScript Project

1. Install the library
```bash
npm i preact-to-nativescript
```
2. Start your Application via preact-to-nativescript
```javascript
var application = require("application")
var render = require("preact-to-nativescript").render

application.start({
  create: () => {
    return render(h("page", {}, [h("actionBar", {title: "Custom Title"}), h("stackLayout", {}, [h("label", {text: "preact-to-nativescript page"}, [])])]))
  }
})
```

# Components
The Usage example uses the plain javascript  [React.createElement / preact.h](https://hackernoon.com/understanding-the-react-source-code-initial-rendering-simple-component-i-80263fe46cf1) syntax. If you appreciate syntactic sugar and like how the following code example looks be sure to try out [preact-nativescript-components](https://github.com/hizoul/preact-nativescript-components)
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

# TBD
- Docs
- Handle Navigation via Nativescripts API (custom routing in pure js works fine though!)
- ActionBar Known Limitations
  - SystemIcon is not respected
  - NavigationButton doesn't properly render

# Credits
- [developit](https://github.com/developit) by basically programming this library and making it possible without even knowing. He provided [this untested document implementation](https://github.com/staydecent/nativescript-preact/issues/4#issuecomment-323900569) which is the most important core part of this library. He also authored [undom](https://github.com/developit/undom) from which some document mock code was borrowed. And he also authored [preact](https://github.com/developit/preact) without which this wouldn't even be possible.
- [staydecent](https://github.com/staydecent) for providing [a code example](https://github.com/staydecent/nativescript-preact) that showed that preact-to-nativescript is not impossible wizardry but achievable by writing the right wrapper