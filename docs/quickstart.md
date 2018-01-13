# Quick Start

The following is assumed to be executed at the project root of a NativeScript Project

\#1: Install the library
```bash
npm i preact-to-nativescript
```

\#2: Adjust your NativeScript app.js

```javascript
var application = require("application")
var render = require("preact-to-nativescript").render

application.start({
  create: () => {
    return render(h("page", {}, [h("actionBar", {title: "Custom Title"}), h("stackLayout", {}, [h("label", {text: "preact-to-nativescript page"}, [])])]))
  }
})
```

\#3: Run your NativeScript app