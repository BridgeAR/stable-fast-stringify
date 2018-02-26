const { test } = require('tap')
const stringify = require('./')
const clone = require('clone')

test('repeated references in objects', function (assert) {
  const daenerys = { name: 'Daenerys Targaryen' }
  const fixture = {
    motherOfDragons: daenerys,
    queenOfMeereen: daenerys
  }
  const expected = JSON.stringify(fixture)
  const actual = stringify(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('repeated references in arrays', function (assert) {
  const daenerys = { name: 'Daenerys Targaryen' }
  const fixture = [daenerys, daenerys]
  const expected = JSON.stringify(fixture)
  const actual = stringify(fixture)
  assert.is(actual, expected)
  assert.end()
})

test('double child reference', function (assert) {
  // create circular reference
  const child = { name: 'Tyrion Lannister' }
  child.dinklage = 'child'

  // include it twice in the fixture
  const fixture = { name: 'Tywin Lannister', childA: child, childB: child }
  const cloned = clone(fixture)
  const expected = JSON.stringify({
    childA: {
      dinklage: 'child', name: 'Tyrion Lannister'
    },
    childB: {
      dinklage: 'child', name: 'Tyrion Lannister'
    },
    name: 'Tywin Lannister'
  })
  const actual = stringify(fixture)
  assert.is(actual, expected)

  // check if the fixture has not been modified
  assert.deepEqual(fixture, cloned)
  assert.end()
})

test('child circular reference with toJSON', function (assert) {
  // Create a test object that has an overriden `toJSON` property
  TestObject.prototype.toJSON = function () { return { special: 'case' } }
  function TestObject (content) {}

  // Creating a simple circular object structure
  const parentObject = {}
  parentObject.childObject = new TestObject()
  parentObject.childObject.parentObject = parentObject

  // Creating a simple circular object structure
  const otherParentObject = new TestObject()
  otherParentObject.otherChildObject = {}
  otherParentObject.otherChildObject.otherParentObject = otherParentObject

  // Making sure our original tests work
  assert.deepEqual(parentObject.childObject.parentObject, parentObject)
  assert.deepEqual(otherParentObject.otherChildObject.otherParentObject, otherParentObject)

  // Should both be idempotent
  assert.equal(stringify(parentObject), '{"childObject":{"special":"case"}}')
  assert.equal(stringify(otherParentObject), '{"special":"case"}')

  // Therefore the following assertion should be `true`
  assert.deepEqual(parentObject.childObject.parentObject, parentObject)
  assert.deepEqual(otherParentObject.otherChildObject.otherParentObject, otherParentObject)

  assert.end()
})

test('null object', function (assert) {
  const expected = JSON.stringify(null)
  const actual = stringify(null)
  assert.is(actual, expected)
  assert.end()
})

test('null property', function (assert) {
  const expected = JSON.stringify({ f: null })
  const actual = stringify({ f: null })
  assert.is(actual, expected)
  assert.end()
})

test('nested child reference in toJSON', function (assert) {
  var circle = { some: 'data' }
  circle.circle = 'circle'
  var a = {
    b: {
      toJSON: function () {
        a.b = 2
        return '[Redacted]'
      }
    },
    baz: {
      circle,
      toJSON: function () {
        a.baz = circle
        return '[Redacted]'
      }
    }
  }
  var o = {
    a,
    bar: a
  }

  const expected = JSON.stringify({
    a: {
      b: '[Redacted]',
      baz: '[Redacted]'
    },
    bar: {
      b: 2,
      baz: {
        circle: 'circle',
        some: 'data'
      }
    }
  })
  const actual = stringify(o)
  assert.is(actual, expected)
  assert.end()
})

test('replacer removing elements', function (assert) {
  const replacer = function (k, v) {
    if (k === 'remove') return
    return v
  }
  const expected = JSON.stringify({ f: null, remove: true }, replacer)
  const actual = stringify({ f: null, remove: true }, replacer)
  assert.is(actual, expected)
  assert.end()
})

test('replacer removing elements and indentation', function (assert) {
  const replacer = function (k, v) {
    if (k === 'remove') return
    return v
  }
  const expected = JSON.stringify({ f: null, remove: true }, replacer, 2)
  const actual = stringify({ f: null, remove: true }, replacer, 2)
  assert.is(actual, expected)
  assert.end()
})

test('replacer removing all elements', function (assert) {
  const replacer = function (k, v) {
    if (k !== '') return
    return k
  }
  const expected = JSON.stringify([{ f: null, remove: true }], replacer)
  const actual = stringify([{ f: null, remove: true }], replacer)
  assert.is(actual, expected)
  assert.end()
})

test('replacer removing all elements and indentation', function (assert) {
  const replacer = function (k, v) {
    if (k !== '') return
    return k
  }
  const expected = JSON.stringify([{ f: null, remove: true }], replacer, 2)
  const actual = stringify([{ f: null, remove: true }], replacer, 2)
  assert.is(actual, expected)
  assert.end()
})

test('array replacer', function (assert) {
  const replacer = ['f', 1, null]
  // The null element will be removed!
  const expected = JSON.stringify({ f: null, null: true, 1: false }, replacer)
  const actual = stringify({ f: null, null: true, 1: false }, replacer)
  assert.is(actual, expected)
  assert.end()
})

test('array replacer and indentation', function (assert) {
  const replacer = ['f', 1, null]
  const date = new Date()
  // The null element will be removed!
  const expected = JSON.stringify({ f: null, null: date, 1: false }, replacer, 2)
  const actual = stringify({ f: null, null: date, 1: false }, replacer, 2)
  assert.is(actual, expected)
  assert.end()
})

test('indent zero', function (assert) {
  const expected = JSON.stringify({ f: null, null: true, 1: false }, null, 0)
  const actual = stringify({ f: null, null: true, 1: false }, null, 0)
  assert.is(actual, expected)
  assert.end()
})

test('replacer and indentation without match', function (assert) {
  const replacer = function (k, v) {
    if (k === '') return v
  }
  const expected = JSON.stringify({ f: 1 }, replacer, '   ')
  const actual = stringify({ f: 1 }, replacer, '   ')
  assert.is(actual, expected)
  assert.end()
})

test('array replacer and indentation without match', function (assert) {
  const replacer = ['']
  const expected = JSON.stringify({ f: 1 }, replacer, '   ')
  const actual = stringify({ f: 1 }, replacer, '   ')
  assert.is(actual, expected)
  assert.end()
})

test('indentation without match', function (assert) {
  const expected = JSON.stringify({ f: undefined }, undefined, 3)
  const actual = stringify({ f: undefined }, undefined, 3)
  assert.is(actual, expected)
  assert.end()
})

test('array nulls and indentation', function (assert) {
  const date = new Date()
  const expected = JSON.stringify([null, date], undefined, 3)
  const actual = stringify([null, date], undefined, 3)
  assert.is(actual, expected)
  assert.end()
})

test('array nulls, replacer and indentation', function (assert) {
  const expected = JSON.stringify([null, /aaa/], (_, v) => v, 3)
  const actual = stringify([null, /aaa/], (_, v) => v, 3)
  assert.is(actual, expected)
  assert.end()
})

test('array nulls, array replacer and indentation', function (assert) {
  const expected = JSON.stringify([null, null], [false], 3)
  const actual = stringify([null, null], [false], 3)
  assert.is(actual, expected)
  assert.end()
})

test('indentation with elements', function (assert) {
  const expected = JSON.stringify({ a: /aaa/ }, null, 5)
  const actual = stringify({ a: /aaa/ }, null, 5)
  assert.is(actual, expected)
  assert.end()
})
