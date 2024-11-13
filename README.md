# Property based testing with [fast-check](https://fast-check.dev/)

This repository provides examples of property based tests you might write. It makes use of **fast-check** - framework written in TypeScript - but can easily be transposed to other frameworks or languages.

In order to add **fast-check** to you project, you have to run:

```bash
npm install fast-check --save-dev
```

If you want to run the properties of this repository locally:

```bash
git clone https://github.com/dubzzz/fast-check-examples.git
cd fast-check-examples
npm install
npm run test
```

Please note that tests of failing implementations have been disabled.

## Property based testing in a nutshell

The motto of property based testing: properties instead of isolated examples - *or in addition to*.

It makes it possible to cover a wider range of inputs and hence find yet undiscovered bugs (see bugs discovered by fast-check: [js-yaml](https://github.com/nodeca/js-yaml/pull/398), [query-string](https://github.com/sindresorhus/query-string/pull/138), [left-pad](https://github.com/stevemao/left-pad/issues/58)).

A property can be summurized by: *for any (a, b, ...) such as precondition(a, b, ...) holds, property(a, b, ...) is true*

Property based testing frameworks try to discover inputs `(a, b, ...)` causing `property(a, b, ...)` to be false. If they find such, they have to reduce the counterexample to a minimal counterexample.

## Tips to find useful properties

Traps to avoid: *testing your code against itself*.

Keep in mind that *properties might not be able to assess the exact value of the output*. But they should be able to test some traits of the output.

Here are some tips that can help you to find your properties.

### Independant of your inputs

**When?** Some characteristics of your output are independant from your input

For instance:
- for any floating point number `d`, `Math.floor(d)` is an integer
- for any integer `n`, `Math.abs(n)` is superior to `0`

### Characteristics derived from the input

**When?** Output has an easy relationship with the input

For instance: if the algorithm computes the average of two numbers
```js
fc.assert(
  fc.property(
    fc.integer(), fc.integer(),
    (a, b) => a <= b
      ? a <= average(a, b) && average(a, b) <= b
      : b <= average(a, b) && average(a, b) <= a));
```

*In other words: the average of a and b must be between a and b*

For instance: if the algorithm factorizes a number
```js
fc.assert(
  fc.property(
    fc.nat(),
    n => factorize(n).reduce((acc, cur) => acc*cur, 1) === n));
```

*In other words: the product of all numbers in the output must be equal to the input*

### Subset of inputs

**When?** Some inputs might have easy outputs

For instance: if the algorithm removes duplicates from an array
```js
fc.assert(
  fc.property(
    fc.set(fc.char()),
    data => assert.deepEqual(removeDuplicates(data), data)));
```

*In other words: removing duplicates of an array of unique values returns the array itself*

For instance: if the algorithm checks if a string contains another one
```js
fc.assert(
  fc.property(
    fc.string(), fc.string(), fc.string(),
    (a, b, c) => contains(b, a + b + c)));
```

*In other words: the concatenation of a, b and c always contains string b*

### Combination of functions

**When?** Two or more functions in your API can be combined to have something simple to assess

#### Round trip

The API provides some kind of encode/decode functions. In this case the round trip is: `decode(encode(value)) === value`.

For instance: if you have two methods zip/unzip
```js
fc.assert(
  fc.property(
    fc.string(),
    v => unzip(zip(v)) === v));
```

*In other words: unzip is the reverse of zip*

#### More general combination

For instance: if you provide lcm and gcd
```js
fc.assert(
  fc.property(
    fc.nat(), fc.nat(),
    (a, b) => lcm(a, b) * gcd(a, b) === a * b));
```

### Compare to a simpler version

**When?** There is a slower but simpler implementation or you are rewriting the code

For instance: if the algorithm checks that a sorted array contains a given value in a binary way
```js
fc.assert(
  fc.property(
    fc.char(), fc.array(fc.char()).map(d => d.sort()),
    (c, data) => binaryContains(c, data) === linearContains(c, data)));
```

*In other words: binaryContains and linearContains must always agree, only the complexity differs*

## More on Property Based Testing

More details on Property based testing at:
- [John Hughes — Don’t Write Tests](https://www.youtube.com/watch?v=hXnS_Xjwk2Y)
- [Generating test cases so you don’t have to (Spotify)](https://labs.spotify.com/2015/06/25/rapid-check/)

Remember that property based does not replace example based testing.
Nonetheless it can cover a larger range of inputs and potentially catch problems not seen with examples.
