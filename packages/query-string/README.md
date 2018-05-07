# query-string

Total downloads: ![total downloads](https://img.shields.io/npm/dt/query-string.svg)

## Bug discovered using property based testing (fast-check)

**Issue detected:** enabling the `bracket` setting when exporting arrays containing null values produces an invalid output for the parser \[[more](https://github.com/sindresorhus/query-string/pull/138)\]

**Code example:**
```js
m.stringify({bar: ['a', null, 'b']}, {arrayFormat: 'bracket'}) //=> "bar[]=a&bar&bar[]=b"
m.parse('bar[]=a&bar&bar[]=b', {arrayFormat: 'bracket'}) //=> {bar: [null, 'b']}
```

**Fixed at:** 6.1.0

## Properties

### [A] should read correctly from stringified query params

    for any query parameters `params` and any options `options`
    reading back what has been stringified should rebuild the original query parameters

    in other words:

    for any query parameters `params` and any options `options`
    parse(stringify(`params`, `options`)) === `params`
