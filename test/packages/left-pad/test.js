import * as assert from 'assert';
import * as fc from 'fast-check';
const leftPad = require('left-pad');

const lengthUnicode = s => [...s].length;

describe('left-pad', () => {
  it('should be able to pad simple strings with utf-16 characters', () => {
    fc.assert(
      fc.property(
        fc.unicodeString(),
        fc.nat(100),
        fc.fullUnicode(),
        (s, additionalPad, c) =>
          lengthUnicode(leftPad(s, lengthUnicode(s) + additionalPad, c)) === lengthUnicode(s) + additionalPad
      )
    );
  });
  xit('should be able to pad utf-16 strings', () => {
    fc.assert(
      fc.property(
        fc.fullUnicodeString(),
        fc.nat(100),
        (s, additionalPad) =>
          lengthUnicode(leftPad(s, lengthUnicode(s) + additionalPad)) === lengthUnicode(s) + additionalPad
      )
    );
  });
});
