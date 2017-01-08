const fs = require('fs')
const fspath = require('path')
var xmldoc = require('xmldoc')

module.exports.testsuiteCount = 0
module.exports.testsuites = []

function parseXmlFromFile (fileName) {
  var xmlFile = fs.readFileSync(fileName, 'utf8')
  var xmlDoc = new xmldoc.XmlDocument(xmlFile)
  module.exports.testsuites = xmlDoc.childrenNamed('testsuite')
  module.exports.testsuiteCount = module.exports.testsuites.length
  return xmlDoc
}

function listXmlFiles (path) {
  try {
    var xmlFiles = fs.readdirSync(path)
      .map(function (file) {
        return fspath.join(path, file)
      })
      // Fiter out non-files
      .filter(function (file) {
        return fs.statSync(file).isFile()
      })
      // Only return files ending in '.xml'
      .filter(function (file) {
        return file.slice(-4) === '.xml'
      })
    // No files returned
    if (!xmlFiles.length > 0) {
      return 'No xml files found'
    }
    // Return the array of files ending in '.xml'
    return xmlFiles
  } catch (e) {
    if (e.code === 'ENOENT') {
      // Bad directory
      return 'Bad directory'
    }
    // Unknown error
    return e
  }
}

function getTestsuites (filename) {
  var testsuitesXml = parseXmlFromFile(filename).childrenNamed('testsuite')
  var testsuites = ''
  testsuitesXml.forEach(function (testsuite) {
    testsuites += testsuite.toString() + '\n'
  })
  return testsuites
}

function mergeFiles (files) {
  var mergedTestSuites = ''
  files.forEach(function (file) {
    mergedTestSuites += getTestsuites(file) + '\n'
  })
  var mergedFile = '<?xml version="1.0"?>\n' +
                   '<testsuites>\n' +
                   mergedTestSuites +
                   '</testsuites>'
  return mergedFile
}

function writeMergedFile (file, data) {
  fs.writeFileSync(file, data)
}

module.exports = {
  listXmlFiles: listXmlFiles,
  mergeFiles: mergeFiles,
  getTestsuites: getTestsuites,
  writeMergedFile: writeMergedFile
}
