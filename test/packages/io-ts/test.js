import * as fc from 'fast-check';
import * as t from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

const expandToIoAndInstance = rawValues => {
  const io = rawValues.reduce((p, e) => {
    p[e[0]] = e[1][0];
    return p;
  }, {});
  const instance = rawValues.reduce((p, e) => {
    p[e[0]] = e[1][1];
    return p;
  }, {});
  return { io, instance };
};

const ValidTypeDefValueArb = fc
  .set(
    fc.tuple(
      fc.fullUnicodeString(),
      fc.oneof(
        fc.tuple(fc.constant(t.null), fc.constant(null)),
        fc.tuple(fc.constant(t.undefined), fc.constant(undefined)),
        fc.tuple(fc.constant(t.string), fc.fullUnicodeString()),
        fc.tuple(fc.constant(t.number), fc.double()),
        fc.tuple(fc.constant(t.boolean), fc.boolean()),
        fc.tuple(fc.constant(t.any), fc.anything()),
        fc.tuple(fc.constant(t.object), fc.object()),
        fc.tuple(fc.constant(t.Integer), fc.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)),
        fc.tuple(fc.constant(t.Array), fc.array(fc.anything())),
        fc.tuple(fc.constant(t.array(t.number)), fc.array(fc.integer())),
        fc.tuple(fc.constant(t.Dictionary), fc.dictionary(fc.fullUnicodeString(), fc.anything())),
        fc.tuple(fc.constant(t.Function), fc.func(fc.integer()))
      )
    ),
    (a, b) => a[0] === b[0]
  )
  .map(expandToIoAndInstance);

const generationChoices = {
  null: fc.constant(null),
  undefined: fc.constant(undefined),
  string: fc.fullUnicodeString(),
  number: fc.double(),
  boolean: fc.boolean(),
  object: fc.object(),
  integer: fc.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
  array: fc.array(fc.integer()),
  dict: fc.dictionary(fc.fullUnicodeString(), fc.anything()),
  func: fc.func(fc.integer())
};
const allBut = (...forbidden) => {
  return fc.oneof(
    ...Object.keys(generationChoices)
      .filter(k => forbidden.indexOf(k) === -1)
      .map(k => generationChoices[k])
  );
};
const InvalidTypeDefValueArb = fc
  .set(
    fc.tuple(
      fc.fullUnicodeString(),
      fc.oneof(
        fc.tuple(fc.constant(t.null), allBut('null')),
        fc.tuple(fc.constant(t.undefined), allBut('undefined')),
        fc.tuple(fc.constant(t.string), allBut('string')),
        fc.tuple(fc.constant(t.number), allBut('number', 'integer')),
        fc.tuple(fc.constant(t.boolean), allBut('boolean')),
        fc.tuple(fc.constant(t.object), allBut('object', 'dict', 'array')), //array??
        fc.tuple(fc.constant(t.Integer), allBut('integer')),
        fc.tuple(fc.constant(t.Array), allBut('array')),
        fc.tuple(fc.constant(t.array(t.number)), allBut('array')),
        fc.tuple(fc.constant(t.Dictionary), allBut('object', 'dict', 'array')), //array??
        fc.tuple(fc.constant(t.Function), allBut('func'))
      )
    ),
    1,
    10,
    (a, b) => a[0] === b[0]
  )
  .map(expandToIoAndInstance);

describe('io-ts', () => {
  describe('t.type', () => {
    it('should fail to decode instance with missing keys', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, ValidTypeDefValueArb, (v1, v2) => {
          const foundExtra = Object.keys(v2.instance).find(
            k => !v1.instance.hasOwnProperty(k) && v2.io[k] !== t.any && v2.io[k] !== t.undefined
          );
          fc.pre(foundExtra);
          const io = Object.assign(Object.assign({}, v2.io), v1.io);
          const Schema = t.type(io);
          try {
            ThrowReporter.report(Schema.decode(v1.instance));
            return false;
          } catch (err) {
            return true;
          }
        })
      );
    });
    it('should fail to decode instance with invalid values', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, InvalidTypeDefValueArb, (v1, v2) => {
          const io = Object.assign(Object.assign({}, v1.io), v2.io);
          const instance = Object.assign(Object.assign({}, v1.instance), v2.instance);
          const Schema = t.type(io);
          try {
            ThrowReporter.report(Schema.decode(instance));
            return false;
          } catch (err) {
            return true;
          }
        }),
        { verbose: true }
      );
    });
    it('should successfully decode exact instance', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, ({ io, instance }) => {
          const Schema = t.type(io);
          ThrowReporter.report(Schema.decode(instance));
        })
      );
    });
    it('should successfully decode valid instance', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, fc.object(), ({ io, instance }, instance2) => {
          const Schema = t.type(io);
          const obj = Object.assign(Object.assign({}, instance2), instance);
          ThrowReporter.report(Schema.decode(obj));
        })
      );
    });
  });
  describe('t.exact', () => {
    it('should fail to decode instance with missing keys', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, ValidTypeDefValueArb, (v1, v2) => {
          const foundExtra = Object.keys(v2.instance).find(
            k => !v1.instance.hasOwnProperty(k) && v2.io[k] !== t.any && v2.io[k] !== t.undefined
          );
          fc.pre(foundExtra);
          const io = Object.assign(Object.assign({}, v2.io), v1.io);
          const Schema = t.exact(t.type(io));
          try {
            ThrowReporter.report(Schema.decode(v1.instance));
            return false;
          } catch (err) {
            return true;
          }
        })
      );
    });
    it('should fail to decode instance with invalid values', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, InvalidTypeDefValueArb, (v1, v2) => {
          const io = Object.assign(Object.assign({}, v1.io), v2.io);
          const instance = Object.assign(Object.assign({}, v1.instance), v2.instance);
          const Schema = t.exact(t.type(io));
          try {
            ThrowReporter.report(Schema.decode(instance));
            return false;
          } catch (err) {
            return true;
          }
        }),
        { verbose: true }
      );
    });
    it('should fail to decode instance with more keys', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, fc.object(), ({ io, instance }, instance2) => {
          const Schema = t.exact(t.type(io));
          const obj = Object.assign(Object.assign({}, instance2), instance);
          const foundExtra = Object.keys(instance2).find(k => !instance.hasOwnProperty(k));
          fc.pre(foundExtra);
          try {
            ThrowReporter.report(Schema.decode(obj));
            return false;
          } catch (err) {
            return true;
          }
        })
      );
    });
    it('should successfully decode exact instance', () => {
      fc.assert(
        fc.property(ValidTypeDefValueArb, ({ io, instance }) => {
          const Schema = t.exact(t.type(io));
          ThrowReporter.report(Schema.decode(instance));
        })
      );
    });
  });
  describe('t.union', () => {
    it('should successfully decode exact instance', () => {
      fc.assert(
        fc.property(fc.array(ValidTypeDefValueArb, 1, 10), vs => {
          const Schema = t.union(vs.map(v => t.type(v.io)));
          ThrowReporter.report(Schema.decode(vs[0].instance));
        })
      );
    });
  });
});
