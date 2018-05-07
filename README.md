# Examples based on [fast-check](https://github.com/dubzzz/fast-check)

**fast-check** is a property based testing framework written in TypeScript.

It can easily be installed using npm:

```bash
npm install fast-check --save-dev
```

This repository has two main targets:
- reference useful materials and examples to help users of fast-check
- give examples of properties

## Property based testing in a nutshell

Testing properties instead of isolated examples.
It makes it possible to cover a wider range of inputs and hence find yet undiscovered bugs (see bugs discovered by fast-check: [js-yaml](https://github.com/nodeca/js-yaml/pull/398), [query-string](https://github.com/sindresorhus/query-string/pull/138), [left-pad](https://github.com/stevemao/left-pad/issues/58)).

A property can be summurized by: *for any (a, b, ...) such as precondition(a, b, ...) holds, property(a, b, ...) is true*

## Tips to find useful properties

Traps to avoid: *testing your code against itself*.

Keep in mind that *properties might not be able to assess the exact value of the output*. But they should be able to test some traits of the output.

Here are some tips that can help you to find your properties.

### Bounded output

Sometimes the output of your algorithm might be easy to verify.
Your output might have some easy relationship with the input.

For instance: if the algorithm computes the average of two numbers
```js
fc.assert(
  fc.property(
    fc.integer(), fc.integer()
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

Sometimes some inputs might have easy outputs.

For instance: if the algorithm removes duplicates from an array
```js
fc.assert(
  fc.property(
    fc.set(fc.char()),
    data => assert.equal(removeDuplicates(data), data)));
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

### Compare to a simpler version

Whenever your algorithm can be seen as an optimized version of another, you might compare the two algorithms in terms of their outputs.

For instance: if the algorithm checks that a sorted array contains a given value in a binary way
```js
fc.assert(
  fc.property(
    fc.char(), fc.array(fc.char()).map(d => d.sort()),
    (c, data) => binaryContains(c, data) === linearContains(c, data)));
```

*In other words: binaryContains and linearContains must always agree, only the complexity differs*

### Combination of functions

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

## Project structure

The examples provided in this repository always come with a readme file and an implementation based on fast-check. The readme should describe briefly the algorithm being tested and give examples of properties that might be applied.

## More on Property Based Testing

More details on Property based testing at:
- [John Hughes — Don’t Write Tests](https://www.youtube.com/watch?v=hXnS_Xjwk2Y)
- [Generating test cases so you don’t have to (Spotify)](https://labs.spotify.com/2015/06/25/rapid-check/)

Remember that property based does not replace example based testing.
Nonetheless it can cover a larger range of inputs and potentially catch problems not seen with examples.
