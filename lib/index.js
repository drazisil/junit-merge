const fs = require('fs')
var xmldoc = require('xmldoc')

module.exports.testsuiteCount = 0
module.exports.testsuites = []

function parseXmlFromFile (fileName, callback) {
  var xmlFile = fs.readFileSync(fileName, 'utf8')
  var xmlDoc = new xmldoc.XmlDocument(xmlFile)
  module.exports.testsuites = xmlDoc.childrenNamed('testsuite')
  module.exports.testsuiteCount = module.exports.testsuites.length
  return xmlDoc
}

module.exports = {
  parseXmlFromFile: parseXmlFromFile
}
