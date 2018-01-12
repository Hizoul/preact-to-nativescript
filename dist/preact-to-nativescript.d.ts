import * as preact from "preact"

declare module "preact-to-nativescript" {
  const render = (component: any) => any
  const Preact = preact
  export {
    render, Preact
  }
}