# Examples based on [fast-check](https://github.com/dubzzz/fast-check)

**fast-check** is a property based testing framework written in TypeScript.

It can easily be installed using npm:

```
npm install fast-check --save-dev
```

This repository has two main targets:
- reference useful materials and examples to help users of fast-check
- give examples of properties

## Project structure

The examples provided in this repository always come with a readme file and an implementation based on fast-check. The readme should describe briefly the algorithm being tested and give examples of properties that might be applied.

## More on Property Based Testing

More details on Property based testing at:
- [John Hughes — Don’t Write Tests](https://www.youtube.com/watch?v=hXnS_Xjwk2Y)
- [Generating test cases so you don’t have to (Spotify)](https://labs.spotify.com/2015/06/25/rapid-check/)

Remember that property based does not replace example based testing.
Nonetheless it can cover a larger range of inputs and potentially catch problems not seen with examples.
