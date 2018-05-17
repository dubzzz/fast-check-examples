import * as assert from 'assert';
import * as fc from 'fast-check';
import { stableSort } from './implem';

const count = (tab, element) => tab.filter(v => v === element).length;

describe('stable sort', () => {
  it('should contain the same items', () =>
    fc.assert(
      fc.property(fc.array(fc.integer()), data => {
        const sorted = stableSort(data.slice(0), (a, b) => a - b);
        assert.equal(sorted.length, data.length);
        for (const item of data) assert.equal(count(sorted, item), count(data, item));
      })
    ));
  it('should produce ordered array', () =>
    fc.assert(
      fc.property(fc.array(fc.integer()), data => {
        const sorted = stableSort(data, (a, b) => a - b);
        for (let idx = 1; idx < sorted.length; ++idx) assert.ok(sorted[idx - 1] <= sorted[idx]);
      })
    ));
  it('should be stable', () =>
    fc.assert(
      fc.property(fc.array(fc.record({ key1: fc.nat(5), key2: fc.nat(5) })), data => {
        const singleSort = stableSort(data, (a, b) => {
          if (a.key2 < b.key2) return -1;
          else if (a.key2 > b.key2) return 1;
          return a.key1 - b.key1;
        });
        const sorted = stableSort(stableSort(data, (a, b) => a.key1 - b.key1), (a, b) => a.key2 - b.key2);
        assert.deepStrictEqual(sorted, singleSort);
      })
    ));
});
