'use strict'

const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const stringify = require('.')

const array = new Array(10).fill(0).map((_, i) => i)
const simple = { foo: 'simple', a: 1, b: 2, c: 3, array, nest: { foo: 'bar' } }

const deep = require('./package.json')
deep.deep = JSON.parse(JSON.stringify(deep))
deep.deep.deep = JSON.parse(JSON.stringify(deep))
deep.deep.deep.deep = JSON.parse(JSON.stringify(deep))
deep.array = array

// One arg "simple"
suite.add('simple:   array ', function () {
  stringify(array)
})
suite.add('simple:   object', function () {
  stringify(simple)
})
suite.add('simple:   deep  ', function () {
  stringify(deep)
})

// Two args "replacer"
suite.add('\nreplacer:   array ', function () {
  stringify(array, (_, v) => v)
})
suite.add('replacer:   object', function () {
  stringify(simple, (_, v) => v)
})
suite.add('replacer:   deep  ', function () {
  stringify(deep, (_, v) => v)
})

// Two args "array"
suite.add('\narray:   array ', function () {
  stringify(array, ['array'])
})
suite.add('array:   object', function () {
  stringify(simple, ['array'])
})
suite.add('array:   deep  ', function () {
  stringify(deep, ['array'])
})

// Three args "full replacer"
suite.add('\nfull replacer:   array ', function () {
  stringify(array, (_, v) => v, 2)
})
suite.add('full replacer:   object', function () {
  stringify(simple, (_, v) => v, 2)
})
suite.add('full replacer:   deep  ', function () {
  stringify(deep, (_, v) => v, 2)
})

// Three args "full array"
suite.add('\nfull array:   array ', function () {
  stringify(array, ['array'], 2)
})
suite.add('full array:   object', function () {
  stringify(simple, ['array'], 2)
})
suite.add('full array:   deep  ', function () {
  stringify(deep, ['array'], 2)
})

// Three args "indentation only"
suite.add('\nindentation:   array ', function () {
  stringify(array, null, 2)
})
suite.add('indentation:   object', function () {
  stringify(simple, null, 2)
})
suite.add('indentation:   deep  ', function () {
  stringify(deep, null, 2)
})

// add listeners
suite.on('cycle', function (event) {
  console.log(String(event.target))
})

suite.on('complete', function () {
  console.log('\nBenchmark done')
})

suite.run({ delay: 1, minSamples: 150 })
