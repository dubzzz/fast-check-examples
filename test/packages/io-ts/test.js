import * as fc from 'fast-check';
import * as t from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

const BaseTypeArbitrary = fc
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
        fc.tuple(fc.constant(t.Integer), fc.integer()),
        fc.tuple(fc.constant(t.Array), fc.array(fc.anything())),
        fc.tuple(fc.constant(t.array(t.number)), fc.array(fc.integer())),
        fc.tuple(fc.constant(t.Dictionary), fc.dictionary(fc.fullUnicodeString(), fc.anything()))
      )
    ),
    (a, b) => a[0] === b[0]
  )
  .map(v => ({
    io: v.reduce((p, e) => {
      p[e[0]] = e[1][0];
      return p;
    }, {}),
    instance: v.reduce((p, e) => {
      p[e[0]] = e[1][1];
      return p;
    }, {})
  }));

const BaseTypeInstanceOnlyArbitrary = BaseTypeArbitrary.map(({ instance }) => instance);

describe('io-ts', () => {
  xit('should fail to decode instance with missing keys', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, BaseTypeArbitrary, (v1, v2) => {
        const foundExtra = Object.keys(v2.instance).find(k => !v1.instance.hasOwnProperty(k));
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
  it('should successfully decode exact instance', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, ({ io, instance }) => {
        const Schema = t.type(io);
        ThrowReporter.report(Schema.decode(instance));
      })
    );
  });
  it('should successfully decode valid instance', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, BaseTypeInstanceOnlyArbitrary, ({ io, instance }, instance2) => {
        const Schema = t.type(io);
        const obj = Object.assign(Object.assign({}, instance2), instance);
        ThrowReporter.report(Schema.decode(obj));
      })
    );
  });
  xit('should fail to decode instance with missing keys for exact', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, BaseTypeArbitrary, (v1, v2) => {
        const foundExtra = Object.keys(v2.instance).find(k => !v1.instance.hasOwnProperty(k));
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
  it('should successfully decode exact instance for exact', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, ({ io, instance }) => {
        const Schema = t.exact(t.type(io));
        ThrowReporter.report(Schema.decode(instance));
      })
    );
  });
  it('should fail to decode instance with more keys', () => {
    fc.assert(
      fc.property(BaseTypeArbitrary, BaseTypeInstanceOnlyArbitrary, ({ io, instance }, instance2) => {
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
  it('should successfully decode exact instance for union', () => {
    fc.assert(
      fc.property(fc.array(BaseTypeArbitrary, 1, 10), vs => {
        const Schema = t.union(vs.map(v => t.type(v.io)));
        ThrowReporter.report(Schema.decode(vs[0].instance));
      })
    );
  });
  /*it('try it', () => {
    const M = t.type({
      key: t.any
    });
    const obj = {};
    console.log(M.decode(obj));
  })*/
});
