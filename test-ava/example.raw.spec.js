// Example of fast-check integration without using ava-fast-check
// See https://github.com/dubzzz/ava-fast-check

import test from 'ava';
import * as fc from 'fast-check';

///*bug*/ const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1;
const contains = (pattern, text) => text.indexOf(pattern) !== -1;

test('The concatenation of a, b and c always contains b', t =>
  t.notThrows(() => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        return contains(b, a + b + c);
      })
    );
  }));
