import * as assert from 'assert';
import * as fc from 'fast-check';
import * as yaml from 'js-yaml';

// Generate valid YAML instances for yaml.safeDump
const yamlArbitrary = fc.object({
  key: fc.fullUnicodeString(),
  values: [
    fc.fullUnicodeString(),
    fc.boolean(),
    fc.integer(),
    fc.double(),
    fc.constantFrom(null, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
  ]
});

// Generate valid options for yaml.safeDump configuration
const dumpOptionsArbitrary = fc
  .record(
    {
      skipInvalid: fc.boolean(),
      sortKeys: fc.boolean(),
      noRefs: fc.boolean(),
      noCompatMode: fc.boolean(),
      condenseFlow: fc.boolean(),
      indent: fc.integer(1, 80),
      flowLevel: fc.integer(-1, 10),
      styles: fc.record(
        {
          '!!null': fc.constantFrom('lowercase', 'canonical', 'uppercase', 'camelcase'),
          '!!int': fc.constantFrom('decimal', 'binary', 'octal', 'hexadecimal'),
          '!!bool': fc.constantFrom('lowercase', 'uppercase', 'camelcase'),
          '!!float': fc.constantFrom('lowercase', 'uppercase', 'camelcase')
        },
        { with_deleted_keys: true }
      )
    },
    { with_deleted_keys: true }
  )
  .map(instance => {
    if (instance.condenseFlow === true && instance.flowLevel !== undefined) {
      instance.flowLevel = -1;
    }
    return instance;
  });

describe('js-yaml', () => {
  it('should be able to read itself', () => {
    fc.assert(
      fc.property(yamlArbitrary, dumpOptionsArbitrary, (obj, dumpOptions) => {
        var yamlContent = yaml.safeDump(obj, dumpOptions);
        assert.ok(typeof yamlContent === 'string');
        assert.deepStrictEqual(yaml.safeLoad(yamlContent), obj);
      })
    );
  });
});
