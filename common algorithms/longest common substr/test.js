import * as assert from 'assert';
import * as fc from 'fast-check';
import { longestCommonSubstr } from './implem';

describe('longest common substr', () => {
  it('should find the same substring lengths whatever the order of the inputs', () =>
    fc.assert(
      fc.property(fc.string(), fc.string(), (s1, s2) => {
        assert.equal(longestCommonSubstr(s1, s2).length, longestCommonSubstr(s2, s1).length);
      })
    ));
  it('should include the substr in both strings', () =>
    fc.assert(
      fc.property(fc.string(), fc.string(), (s1, s2) => {
        const longest = longestCommonSubstr(s1, s2);
        assert.ok(s1.includes(longest));
        assert.ok(s2.includes(longest));
      })
    ));
  it('should detect the longest common', () =>
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (s, prefix, suffix) => {
        assert.equal(longestCommonSubstr(prefix + s + suffix, s), s);
      })
    ));
});
