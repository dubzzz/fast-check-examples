# left-pad

Total downloads: ![total downloads](https://img.shields.io/npm/dt/left-pad.svg)

## Bug discovered using property based testing (fast-check)

**Issue detected:** unicode characters outside of the BMP plan are not handled consistently \[[more](https://github.com/stevemao/left-pad/issues/58)\]

**Code example:**
```js
leftPad('a\u{1f431}b', 4, 'x') //=> 'a\u{1f431}b'  -- in: 3 code points, out: 3 code points
leftPad('abc', 4, '\u{1f431}') //=> '\u{1f431}abc' -- in: 3 code points, out: 4 code points
```

**Fixed at:** N.A

## Properties

### [A] should be able to pad simple strings with utf-16 characters

    for any (string `s`, positive number `additionalPad`, unicode character `c`)
    leftPad(`s`, lengthUnicode(`s`) + `additionalPad`, `c`)) should have been padded by `additionalPad` times `c`

### [B] should be able to pad utf-16 strings

    for any (string `s`, positive number `additionalPad`)
    the unicode length of leftPad(`s`, lengthUnicode(`s`) + `additionalPad`)) should be lengthUnicode(`s`) + `additionalPad`
