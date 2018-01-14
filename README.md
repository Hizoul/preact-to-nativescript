# preact-to-nativescript[![Build Status](https://travis-ci.org/Hizoul/preact-to-nativescript.svg?branch=master)](https://travis-ci.org/Hizoul/preact-to-nativescript) [![Coverage Status](https://coveralls.io/repos/github/Hizoul/preact-to-nativescript/badge.svg?branch=master)](https://coveralls.io/github/Hizoul/preact-to-nativescript?branch=master) [![dependencies](https://david-dm.org/Hizoul/preact-to-nativescript.png)](https://david-dm.org/Hizoul/preact-to-nativescript) [![npm](https://img.shields.io/npm/v/preact-to-nativescript.svg)](https://www.npmjs.com/package/preact-to-nativescript)
## This Library is experimental!
## [Documentation](https://rawgit.com/Hizoul/preact-to-nativescript/master/docs/_book/index.html)

# Usage
The following is assumed to be executed at the project root of a NativeScript project

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

# [Demo Application](https://github.com/Hizoul/preact-nativescript-demo)
![Demo](https://github.com/Hizoul/proposal-for-preact-to-nativescript/raw/master/demo.gif)


# TBD
- [dont ship own preact version](https://github.com/developit/preact/pull/978)
- Handle unmounting properly when navigating via Nativescripts API (custom routing in pure js works fine though!)
- demo app custom router removechild seems to be off by one
- ActionBar Known Limitations
  - SystemIcon is not respected
  - NavigationButton doesn't properly render
- probably a lot more that isn't in scope yet

# Credits
- [developit](https://github.com/developit) by providing [this untested document implementation](https://github.com/staydecent/nativescript-preact/issues/4#issuecomment-323900569) that turned into the core of this library. He also authored [undom](https://github.com/developit/undom) from which some document mock code was borrowed. And he also authored [preact](https://github.com/developit/preact) without which this wouldn't even be possible.
- [staydecent](https://github.com/staydecent) for providing [a code example](https://github.com/staydecent/nativescript-preact) that showed that preact-to-nativescript is not impossible wizardry but achievable by writing the right wrapper