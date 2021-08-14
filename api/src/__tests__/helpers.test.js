const Helpers = require('./../utils/helpers.js')

describe('stringlength tester', () => {
  test('if string has been given', () => {
    expect(Helpers.checkTitleLength()).toBeFalsy()
    expect(Helpers.checkTitleLength(101)).toBeFalsy()
    expect(Helpers.checkTitleLength([])).toBeFalsy()
  })
  test('if string length is not too much', () => {
    expect(Helpers.checkTitleLength("Hello world").length).toBeLessThan(101)
    expect(Helpers.checkTitleLength("Hello world")).toBeTruthy()
  })
  test('string starts with a capital', () => {
    expect(Helpers.checkTitleLength("hello world")).toBeFalsy()
    expect(Helpers.checkTitleLength("Hello world")).toBe("Hello world")
  })
})

describe("generateUUID test", () => {
  test("check if generateUUID() generates something", () => {
    expect(Helpers.generateUUID()).not.toBeUndefined()
  });
  test("check if generated is UUID", () => {
    expect(Helpers.generateUUID()).toMatch(
      /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
    );
  });
});