import { VNode } from "preact"

declare module "preact-to-nativescript" {
  const render: (component: VNode, parent: any, merge: any) => any
  const Preact: any
  export {
    render, Preact
  }
}