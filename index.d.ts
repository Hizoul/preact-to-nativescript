import { VNode, h as hOrig, render as renderOrig } from "preact"

declare module "preact-to-nativescript" {
  const render: renderOrig
  const navigateTo: (component: VNode) => void
  const goBack: () => void
  const Preact: any
  const h: hOrig
  export {
    render, Preact, navigateTo, goBack, h
  }
}