# Using NativeScript Plugins
If you wish to use a plugin like e.g. `nativescript-gradient` you can use the `registerComponent` Function like this

```typescript
import { registerComponent } from "preact-to-nativescript"
registerComponent("gradient", require("nativescript-gradient").Gradient)
```

Afterwards you can just render it via the React.createComponent / h function
```typescript
import { render } from "preact-to-nativescript"
render(h("page", null, [
  h("stackLayout", null, [
    h("gradient")
  ])
]))
```

Or alternatively wrap it around a component like `preact-nativescript-components` does for a JSX-Syntax
```typescript
import { Component, h } from "preact"
import { Page, StackLayout, Label } from "preact-nativescript-components"
const GradientComp = (props: any) => {
  return h("gradient", props)
}
render(
  <Page>
    <StackLayout>
      <GradientComp direction="to right" colors="red, blue">
        <Label text="inside gradient" />
        <Label text="inside gradient" />
        <Label text="inside gradient" />
      </GradientComp>
    </StackLayout>
  </Page>
)
```
