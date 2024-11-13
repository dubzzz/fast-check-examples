import { testProp, fc } from '@fast-check/ava';
import { expect } from 'chai';

///*bug*/ const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1;
const contains = (pattern, text) => text.indexOf(pattern) !== -1;

testProp('The concatenation of a, b and c always contains b', [fc.string(), fc.string(), fc.string()], (t, a, b, c) => {
  t.true(contains(b, a + b + c));
});

testProp(
  'The concatenation of a, b and c always contains b (with expect)',
  [fc.string(), fc.string(), fc.string()],
  (t, a, b, c) => {
    expect(contains(b, a + b + c)).to.be.true;
  }
);
