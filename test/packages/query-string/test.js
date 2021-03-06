import * as assert from 'assert';
import * as fc from 'fast-check';
import * as m from 'query-string';

// Valid query parameters must follow:
// - key can be any unicode string (not empty)
// - value must be one of:
// --> any unicode string
// --> null
// --> array containing values defined above (at least two items)
const queryParamsArbitrary = fc.object({
  key: fc.fullUnicodeString(1, 10),
  values: [
    fc.fullUnicodeString(),
    fc.constant(null),
    fc.array(fc.oneof(fc.fullUnicodeString(), fc.constant(null))).filter(a => a.length >= 2)
  ],
  maxDepth: 0
});

const optionsArbitrary = fc.record({
  arrayFormat: fc.constantFrom('bracket', 'index', 'none'),
  strict: fc.boolean(),
  sort: fc.constant(false)
});

describe('query-string', () => {
  it('should read correctly from stringified query params', () => {
    fc.assert(
      fc.property(queryParamsArbitrary, optionsArbitrary, (obj, opts) =>
        assert.deepEqual(m.parse(m.stringify(obj, opts), opts), obj)
      )
    );
  });
});
