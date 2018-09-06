# stable-fast-stringify

[![Greenkeeper badge](https://badges.greenkeeper.io/BridgeAR/stable-fast-stringify.svg)](https://greenkeeper.io/)

Very fast deterministic serialization alternative to [`JSON.stringify`][].

## Install

```md
npm install stable-fast-stringify
```

## Example

```js
const stringify = require('stable-fast-stringify');
const obj = { c: 1, d: 'foo', b: [{ z: 6, x: 9 }, 8], a: 2 };
console.log(stringify(obj));
// {"a":2,"b":[{"x":4,"y":5,"z":6},8],"c":8}
```

If you would like to also have a very fast `safe` deterministic alternative see
[safe-stable-stringify][]. It will not throw in case circular structures are
found.

## Usage

The same as [`JSON.stringify`][].

`stringify(value[, replacer[, space]])`

```js
const stringify = require('stable-fast-stringify')
const o = { b: 1, a: 0 }

console.log(stringify(o))
// '{"a":0,"b":1}'
console.log(JSON.stringify(o))
// '{"b":1,"a":0}'

function replacer(key, value) {
  console.log('Key:', stringify(key))
  return value
}
const serialized = stringify(o, replacer, 2)
// Key: ""
// Key: "a"
// Key: "b"
console.log(serialized)
// {
//   "a": 0,
//   "b": 1
// }
```

## Differences to JSON.stringify

The only difference to [`JSON.stringify`][] is that the stringified output is
deterministic. This is done by sorting the keys instead of using the insertion
order.

[`toJSON`][], [`replacer`][] and the [`spacer`][] work the same
as with the native JSON.stringify.

## Performance / Benchmarks

Currently this is by far the fastest known stable stringify implementation.
This is especially important for big objects.

(Lenovo T450s with a i7-5600U CPU using Node.js 8.9.4)

```md
simple:   array  x 2,362,373 ops/sec ±1.95% (89 runs sampled)
simple:   object x 675,612 ops/sec ±0.68% (93 runs sampled)
simple:   deep   x 18,857 ops/sec ±0.79% (90 runs sampled)

replacer:   array  x 1,520,677 ops/sec ±0.51% (95 runs sampled)
replacer:   object x 562,876 ops/sec ±0.66% (89 runs sampled)
replacer:   deep   x 17,650 ops/sec ±0.97% (93 runs sampled)

indentation:   array  x 1,809,830 ops/sec ±5.94% (79 runs sampled)
indentation:   object x 503,873 ops/sec ±5.53% (85 runs sampled)
indentation:   deep   x 16,084 ops/sec ±0.63% (93 runs sampled)
```

Comparing `stable-fast-stringify` with known alternatives:

```md
json-stringify-deterministic x 6,188 ops/sec ±2.30% (92 runs sampled)
json-stable-stringify x 7,610 ops/sec ±1.14% (92 runs sampled)
faster-stable-stringify x 9,239 ops/sec ±0.65% (86 runs sampled)
fast-json-stable-stringify x 9,537 ops/sec ±1.98% (89 runs sampled)
fast-stable-stringify x 11,270 ops/sec ±1.60% (94 runs sampled)
fast-safe-stringify x 15,516 ops/sec ±0.46% (95 runs sampled)

this x 25,991 ops/sec ±0.64% (85 runs sampled)

JSON.stringify x 44,440 ops/sec ±0.55% (95 runs sampled)
```

Note: JSON.stringify is just used as a baseline comparison and the
`fast-safe-stringify` comparison uses the modules stable implementation.

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT

[`replacer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The%20replacer%20parameter
[`spacer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The%20space%20argument
[`toJSON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
[`JSON.stringify`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[safe-stable-stringify]: https://github.com/BridgeAR/safe-stable-stringify
