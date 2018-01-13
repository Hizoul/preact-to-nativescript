import { findWhere, noOp } from "../index"

test("findWhere", () => {
  const arr = ["A", "b", "c"]
  expect(findWhere(arr, "b", true)).toBe(1)
  expect(findWhere(arr, "b", false)).toBe("b")
  expect(findWhere(arr, (el) => el === "c", true)).toBe(2)
  expect(noOp()).toBe(null)
})
