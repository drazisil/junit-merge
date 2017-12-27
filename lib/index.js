const fs = require("fs");
const fspath = require("path");
const read = require("fs-readdir-recursive");
var xmldoc = require("xmldoc");

module.exports.testsuiteCount = 0;
module.exports.testsuites = [];

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

function listXmlFiles(path, recursive) {
  return new Promise((resolve, reject) => {
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
        reject(new Error("No xml files found"));
      } else {
        // Return the array of files ending in '.xml'
        resolve(xmlFiles);
      }
    } catch (e) {
      reject(e);
    }
  });
}

// function listXmlFiles(path, recursive, callback) {
//   try {
//     var allFiles = recursive ? read(path) : fs.readdirSync(path);

//     var xmlFiles = allFiles
//       .map(function(file) {
//         return fspath.join(path, file);
//       })
//       // Fiter out non-files
//       .filter(function(file) {
//         return fs.statSync(file).isFile();
//       })
//       // Only return files ending in '.xml'
//       .filter(function(file) {
//         return file.slice(-4) === ".xml";
//       });
//     // No files returned
//     if (!xmlFiles.length > 0) {
//       callback("No xml files found");
//     } else {
//       // Return the array of files ending in '.xml'
//       callback(null, xmlFiles);
//     }
//   } catch (e) {
//     callback(e);
//   }
// }

function getTestsuites(filename, callback) {
  var xmlFile = parseXmlFromFile(filename);
  if (xmlFile === "File not found") {
    callback("File not found");
  } else {
    try {
      var testsuites = "";
      // Single testsuite, not wrapped in a testsuites
      if (xmlFile.name === "testsuite") {
        callback(null, xmlFile.toString());
      } else {
        // Multiple testsuites, wrapped in a parent
        var testsuitesXml = xmlFile.childrenNamed("testsuite");
        testsuitesXml.forEach(function(testsuite) {
          testsuites += testsuite.toString() + "\n";
        });
        callback(null, testsuites);
      }
    } catch (e) {
      if (e.message === "xmlFile.childrenNamed is not a function") {
        callback("No tests found");
      } else {
        callback(e);
      }
    }
  }
}

function mergeFiles(files, callback) {
  var mergedTestSuites = "";
  files.forEach(function(file) {
    getTestsuites(file, function(err, res) {
      if (err) {
        callback(err);
      } else {
        mergedTestSuites += res + "\n";
      }
    });
  });
  if (mergedTestSuites === "") {
    callback("No tests found");
  } else {
    var mergedFile =
      '<?xml version="1.0"?>\n' +
      "<testsuites>\n" +
      mergedTestSuites +
      "</testsuites>";
    callback(null, mergedFile);
  }
}

function writeMergedFile(file, data, callback) {
  fs.writeFile(file, data, callback);
}

module.exports = {
  listXmlFiles,
  mergeFiles,
  getTestsuites,
  writeMergedFile,
};
