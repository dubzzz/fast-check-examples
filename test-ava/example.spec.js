import test from 'ava';
import * as fc from 'fast-check';

test('The concatenation of a, b and c always contains b', t =>
  t.notThrows(() => {
    ///*bug*/ const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1;
    const contains = (pattern, text) => text.indexOf(pattern) !== -1;
    fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => contains(b, a + b + c)));
  }));
