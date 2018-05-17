import * as fc from 'fast-check';

test('The concatenation of a, b and c always contains b', () => {
  ///*bug*/ const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1;
  const contains = (pattern, text) => text.indexOf(pattern) !== -1;
  fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => contains(b, a + b + c)));
});
test('Also works with fc.assert on expect', () => {
  ///*bug*/ const stringArbitrary = fc.string();
  const stringArbitrary = fc.string(2);
  fc.assert(
    fc.property(stringArbitrary, a => {
      expect(a.length).toBeLessThanOrEqual(2);
    })
  );
});
