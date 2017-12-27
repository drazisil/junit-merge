var junitMerge = require("../lib/index.js");
var should = require("chai").should(); // eslint-disable-line no-unused-vars
var expect = require("chai").expect; // eslint-disable-line no-unused-vars

describe("File Handling", function() {
  describe("listXmlFiles()", function() {
    it("should return 5 files", function() {
      junitMerge.listXmlFiles("test/fixtures").then(res => {
        res.length.should.equal(5);
      });
    });

    it("should return 7 files", function() {
      junitMerge.listXmlFiles("test/fixtures", true).then(res => {
        res.length.should.equal(7);
        })
      });

    it("should report not a valid directory", function() {
      junitMerge.listXmlFiles("bad_dir", false).catch(err => {
        err.code.should.equal("ENOENT");
      });
    });

    it("should report not xml files found", function() {
      junitMerge.listXmlFiles("lib", false).catch(err => {
          err.message.should.equal("No xml files found");
      });
    });
  });

  it("should be able to write a file", function(done) {
    junitMerge.writeMergedFile("test/moo.txt", "moo", function(err, res) {
      if (err) {
        err.should.equal("This should not error");
      } else {
        expect("everything").to.be.ok;
        done();
      }
    });
  });
});

describe("File Handling - Promises", function() {
  describe("listXmlFiles()", function() {
    it("should return 5 files", function() {
      junitMerge.listXmlFiles("test/fixtures").then(res => {
        res.length.should.equal(5);
      });
    });
  });
});
