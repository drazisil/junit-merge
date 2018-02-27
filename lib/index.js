"use strict";

const fs = require("fs");
const fspath = require("path");
const read = require("fs-readdir-recursive");
var xmldoc = require("xmldoc");

module.exports.testsuiteCount = 0;
module.exports.testsuites = [];

/**
 * Read XML from file
 * @param {string} fileName
 */
function parseXmlFromFile(fileName) {
  try {
    var xmlFile = fs.readFileSync(fileName, "utf8");
    var xmlDoc = new xmldoc.XmlDocument(xmlFile);

    // Single testsuite, not wrapped in a testsuites
    if (xmlDoc.name === "testsuite") {
      module.exports.testsuites = xmlDoc;
      module.exports.testsuiteCount = 1;
    } else {
      // Multiple testsuites, wrapped in a parent
      module.exports.testsuites = xmlDoc.childrenNamed("testsuite");
      module.exports.testsuiteCount = module.exports.testsuites.length;
    }

    return xmlDoc;
  } catch (e) {
    if (e.code === "ENOENT") {
      // Bad directory
      return "File not found";
    }
    // Unknown error
    return e;
  }
}

/**
 * List all XML files in directory
 * @param {*} path
 * @param {*} recursive
 */
function listXmlFiles(path, recursive) {
  try {
    var allFiles = recursive ? read(path) : fs.readdirSync(path);

    var xmlFiles = allFiles
      .map(function(file) {
        return fspath.join(path, file);
      })
      // Fiter out non-files
      .filter(function(file) {
        return fs.statSync(file).isFile();
      })
      // Only return files ending in '.xml'
      .filter(function(file) {
        return file.slice(-4) === ".xml";
      });
    // No files returned
    if (!xmlFiles.length > 0) {
      return new Error("No xml files found");
    } else {
      // Return the array of files ending in '.xml'
      return xmlFiles;
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Extract JUNIT test suites from XML
 * @param {*} filename
 */
function getTestsuites(filename) {
  var xmlFile = parseXmlFromFile(filename);
  if (xmlFile === "File not found") {
    throw new Error("File not found");
  } else {
    try {
      var testsuites = "";
      // Single testsuite, not wrapped in a testsuites
      if (xmlFile.name === "testsuite") {
        return xmlFile.toString();
      } else {
        // Multiple testsuites, wrapped in a parent
        var testsuitesXml = xmlFile.childrenNamed("testsuite");
        testsuitesXml.forEach(function(testsuite) {
          testsuites += testsuite.toString() + "\n";
        });
        return testsuites;
      }
    } catch (e) {
      if (e.message === "xmlFile.childrenNamed is not a function") {
        throw new Error("No tests found");
      } else {
        return e;
      }
    }
  }
}

function mergeFiles(files) {
  var mergedTestSuites = "";
  let mergedFile = "";
  files.forEach(function(file) {
    try {
      res = getTestsuites(file);
      mergedTestSuites += res + "\n";
      if (mergedTestSuites === "") {
        throw new Error("No tests found");
      }
    } catch (err) {
      if (err.message != "No tests found") {
        console.error(err);
        throw err;
      }
    }
  });
  mergedFile =
    '<?xml version="1.0"?>\n' +
    "<testsuites>\n" +
    mergedTestSuites +
    "</testsuites>";
  return mergedFile;
}

function writeMergedFile(file, data) {
  fs.writeFileSync(file, data);
}

module.exports = {
  listXmlFiles,
  mergeFiles,
  getTestsuites,
  writeMergedFile,
};
