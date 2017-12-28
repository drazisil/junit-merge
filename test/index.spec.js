var junitMerge = require("../lib/index.js");
var should = require("chai").should(); // eslint-disable-line no-unused-vars
var expect = require("chai").expect; // eslint-disable-line no-unused-vars

describe("File Handling", function() {
  describe("listXmlFiles()", function() {
    it("should return 5 files", function() {
      junitMerge.listXmlFiles("test/fixtures").length.should.equal(5);
    });
  });

  it("should return 7 files", function() {
    junitMerge.listXmlFiles("test/fixtures", true).length.should.equal(7);
  });
});

it("should report not a valid directory", function() {
  try {
    junitMerge.listXmlFiles("bad_dir", false);
  } catch (e) {
    e.code.should.equal("ENOENT");
  }
});

it("should report not xml files found", function() {
  junitMerge
    .listXmlFiles("lib", false)
    .message.should.equal("No xml files found");
});

it("should be able to write a file", function() {
  try {
    junitMerge.writeMergedFile("test/moo.txt", "moo");
    expect("everything").to.be.ok;
  } catch (err) {
    err.should.equal("This should not error");
  }
});
