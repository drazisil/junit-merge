var junitMerge = require('../lib/index.js')
var should = require('chai').should() // eslint-disable-line no-unused-vars
var expect = require('chai').expect // eslint-disable-line no-unused-vars

describe('File Handling', function () {
  describe('listXmlFiles()', function () {
    it('should return 5 files', function () {
      junitMerge.listXmlFiles('test/fixtures', false, function (err, res) {
        if (err) {
          throw err
        } else {
          res.length.should.equal(5)
        }
      })
    })

    it('should return 7 files', function () {
      junitMerge.listXmlFiles('test/fixtures', true, function (err, res) {
        if (err) {
          throw err
        } else {
          res.length.should.equal(7)
        }
      })
    })

    it('should report not a valid directory', function () {
      junitMerge.listXmlFiles('bad_dir', false, function (err, res) {
        if (err) {
          err.code.should.equal('ENOENT')
        } else {
          res.should.equal('This should error')
        }
      })
    })

    it('should report not xml files found', function () {
      junitMerge.listXmlFiles('lib', false, function (err, res) {
        if (err) {
          err.should.equal('No xml files found')
        } else {
          res.should.equal('This should error')
        }
      })
    })
  })

  it('should be able to write a file', function (done) {
    junitMerge.writeMergedFile('test/moo.txt', 'moo', function (err, res) {
      if (err) {
        err.should.equal('This should not error')
      } else {
        expect('everything').to.be.ok
        done()
      }
    })
  })
})
