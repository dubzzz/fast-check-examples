# is-thirteen

Total downloads: ![total downloads](https://img.shields.io/npm/dt/is-thirteen.svg)

## Bug discovered using property based testing (fast-check)

**Issue detected:** theoretically any string containing exactly 13 times the same character should be a valid isThirteen case, unfortunately it fails when the code-point is above 0xffff \[[more](https://github.com/jezen/is-thirteen/pull/557/)\]

**Code example:** `is("🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱").thirteen()` returns false while `is("!!!!!!!!!!!!!").thirteen()` returns true.

## Properties

### [A] should validate a string being 13 times the same character

    for any character `c`
    the string containing 13 times `c` must be valid for isThirteen
