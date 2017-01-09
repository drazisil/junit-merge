const util = require('util')
var junitMerge = require('../lib/index.js')
var should = require('chai').should() // eslint-disable-line no-unused-vars

util.inspect.defaultOptions.depth = null

describe('File Handling', function () {
  describe('listXmlFiles()', function () {
    it('should return 3 files', function () {
      junitMerge.listXmlFiles('test/fixtures', function (err, res) {
        if (err) {
          throw err
        } else {
          res.length.should.equal(4)
        }
      })
    })

    it('should report not a valid directory', function () {
      junitMerge.listXmlFiles('bad_dir', function (err, res) {
        if (err) {
          err.should.equal('Bad directory')
        } else {
          res.should.equal('This should error')
        }
      })
    })

    it('should report not xml files found', function () {
      junitMerge.listXmlFiles('lib', function (err, res) {
        if (err) {
          console.log(err)
          err.should.equal('No xml files found')
        } else {
          res.should.equal('This should error')
        }
      })
    })

    it('should cause an permission denied error', function () {
      junitMerge.listXmlFiles('/var/root', function (err, res) {
        if (err) {
          err.code.should.equal('EACCES')
        } else {
          res.should.equal('This should error')
        }
      })
    })
  })
})

describe('XML Handling', function () {
  describe('getTestsuites()', function () {
    it('should return 1 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/1.xml', function (err, res) {
        if (err) {
          throw err
        }
        junitMerge.testsuiteCount.should.equal(1)
      })
    })

    it('should return 2 testsuites', function () {
      junitMerge.getTestsuites('./test/fixtures/3.xml', function (err, res) {
        if (err) {
          throw err
        }
        junitMerge.testsuiteCount.should.equal(2)
      })
    })

    it('should return No tests found', function () {
      junitMerge.mergeFiles(['./test/fixtures/empty.xml'], function (err, res) {
        if (err) {
          err.should.equal('No tests found')
        } else {
          res.should.equal('This should error')
        }
      })
    })

    it('should return merged xml file', function () {
      junitMerge.mergeFiles(['./test/fixtures/1.xml', './test/fixtures/3.xml'], function (err, res) {
        if (err) {
          throw err
        }
        res.length.should.equal(1077)
      })
    })

    it('should return No testsuites found', function () {
      junitMerge.getTestsuites('./test/fixtures/12.xml', function (err, res) {
        if (err) {
          err.should.equal('File not found')
        } else {
          res.should.equal(null)
        }
      })
    })

    it('should return Bad directory', function () {
      junitMerge.listXmlFiles('./moo', function (err, res) {
        if (err) {
          err.should.equal('Bad directory')
        } else {
          res.should.equal(null)
        }
      })
    })
  })
})
