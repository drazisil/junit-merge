const fs = require('fs')
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

function listFiles (path) {
  return fs.readdirSync(path)
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
    console.log(file)
  })
  var mergedFile = '<?xml version="1.0"?>\n' +
                   '<testsuites>\n' +
                   mergedTestSuites +
                   '</testsuites>'
  return mergedFile
}

module.exports = {
  listFiles: listFiles,
  mergeFiles: mergeFiles,
  parseXmlFromFile: parseXmlFromFile
}
