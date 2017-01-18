import * as jasmine from 'jasmine'

console.log('loaded')

jasmine.describe("A suite", function() {
  jasmine.it("contains spec with an expectation", function() {
    jasmine.expect(true).toBe(true);
  });
});