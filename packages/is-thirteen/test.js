import * as assert from 'assert';
import * as fc from 'fast-check';
const is = require('is-thirteen');

describe('is-thirteen', () => {
  xit('should validate a string being 13 times the same character', () => {
    fc.assert(fc.property(fc.fullUnicode(), c => is(c.repeat(13)).thirteen()));
  });
});
