# fast-check

Total downloads: ![total downloads](https://img.shields.io/npm/dt/fast-check.svg)

And what if fast-check was testing itself? Here is an extract of properties that can be defined for the arbitraries of fast-check.

Tests of fast-check are available on the official repository: [here](https://github.com/dubzzz/fast-check/tree/master/test/unit).

## Properties

### [A] should produce the same value given the same seed

    for any seed `s`
    `arbitrary().generate(Random(s)) === arbitrary().generate(Random(s))`

### [B] should produce the same shrunk values given the same seed

    for any seed `s`, shrink path `path`
    `generateShrinks(s, path) === generateShrinks(s, path)`

### [C] should produce strictly smaller values along the shrink path

    for any seed `s`, shrink path `path`
    `generateShrinks(s, path)[idx] < generateShrinks(s, path)[idx-1]`, for all `idx`

### [D] should always generate correct values

    for any seed `s`
    `arbitrary().generate(Random(s))` is a valid value (right type, right range...)

### [E] should always shrink to correct values

    for any seed `s`, shrink path `path`
    `generateShrinks(s, path)[idx]` is a valid value, for all `idx`
