const test = require('tape');
const fc = require('fast-check');

///*bug*/ const contains = (pattern, text) => text.substr(1).indexOf(pattern) !== -1;
const contains = (pattern, text) => text.indexOf(pattern) !== -1;

test('The concatenation of a, b and c always contains b', assert => {
  assert.plan(1);
  assert.doesNotThrow(() => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        return contains(b, a + b + c);
      })
    );
  });
});
