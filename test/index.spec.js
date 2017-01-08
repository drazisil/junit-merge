const util = require('util')
var assert = require('assert')
var junitMerge = require('../lib/index.js')
var should = require('chai').should() // eslint-disable-line no-unused-vars

util.inspect.defaultOptions.depth = null

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4))
    })
  })
})

describe('XML Handling', function () {
  describe('parseXmlFromFile()', function () {
    it('should return 6 total tests 1', function () {
      junitMerge.parseXmlFromFile('./test/fixtures/1.xml')
      junitMerge.testsuiteCount.should.equal(1)
    })

    it('should return 6 total tests 2', function () {
      junitMerge.parseXmlFromFile('./test/fixtures/3.xml')
      junitMerge.testsuiteCount.should.equal(2)
    })
  })
})
