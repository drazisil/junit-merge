const util = require('util')
var junitMerge = require('../lib/index.js')
var should = require('chai').should() // eslint-disable-line no-unused-vars

util.inspect.defaultOptions.depth = null

describe('File Handling', function () {
  describe('listXmlFiles()', function () {
    it('should return 3 files', function () {
      junitMerge.listXmlFiles('test/fixtures').length.should.equal(3)
    })

    it('should report not a valid directory', function () {
      junitMerge.listXmlFiles('bad_dir').should.equal('Bad directory')
    })

    it('should report not xml files found', function () {
      junitMerge.listXmlFiles('lib').should.equal('No xml files found')
    })

    it('should cause an unknown error', function () {
      junitMerge.listXmlFiles('/var/root')
      'No xml files found'.should.equal('No xml files found')
    })
  })
})

describe('XML Handling', function () {
  describe('getTestsuites()', function () {
    it('should return 1 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/1.xml')
      junitMerge.testsuiteCount.should.equal(1)
    })

    it('should return 2 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/3.xml')
      junitMerge.testsuiteCount.should.equal(2)
    })
  })

  describe('getTestsuites()', function () {
    it('should return merged xml file', function () {
      junitMerge.mergeFiles(['./test/fixtures/1.xml', './test/fixtures/3.xml']).length.should.equal(1077)
    })
  })
})
