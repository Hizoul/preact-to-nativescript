import { Preact, navigateTo, goBack } from "../index"
import * as frame from "tns-core-modules/ui/frame"

test("navigateTo", () => {
  const topmost = frame.topmost()
  console.log("got topmost", topmost)
  expect(topmost.navigatedTo).toMatchSnapshot("didnt navigate yet")
  expect(topmost.backCallAmount).toBe(0)
  navigateTo(Preact.h("page"))
  expect(topmost.navigatedTo).toMatchSnapshot("navigated to page")
  expect(topmost.backCallAmount).toBe(0)
  topmost.goBack()
  expect(topmost.backCallAmount).toBe(1)
  goBack()
  expect(topmost.backCallAmount).toBe(2)
})
