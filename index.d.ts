declare module "preact-to-nativescript" {
  import { VNode, h, Component } from "preact"
  import { Page } from "tns-core-modules/ui/page"
  const render: (node: JSX.Element,
    parent: Element | Document | NavigationEntry | null, mergeWith?:Element) => Page
  const navigateTo: (component: VNode) => void
  const goBack: () => void
  const preload: () => void
  const registerComponent: (name: string, comopnent: any) => void
  const Preact: any
  export {
    render, Preact, navigateTo, goBack, h, Component, preload, registerComponent
  }
}