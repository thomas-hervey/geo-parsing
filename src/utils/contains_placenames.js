const fs = require('fs').promises
var exec = require('child-process-promise').exec
const { parseString } = require('xml2js')
const { getLocality } = require('./get_locality')
const pythonClient = require('../text_processing/nlp/python_client')

const _toUpper = input => {
  input = input.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  return input
}

const _parseEGP = async (record, value, options) => {

  let references = []
  // if (!options.locality) { options.locality = null }

  const { parsing_data_path } = options.geoparsing
  const { EGP_execute_script, EGP_run_script_path, type, gaz } = options.geoparsing.EGP


  // ************************************* //
  // create temporary file for EGP to read //
  // ************************************* //
  value = _toUpper(value) // HACK: uppercase words so EGP thinks they may be placenames
  await fs.writeFile(parsing_data_path, value)


  // ****************** //
  // run parser on file
  // ****************** //

  // get the locality of the query if there is one
  if (record.dataValues.dimension_hostname) {
    options.locality = await getLocality(record.dataValues.dimension_hostname, options)
  }

  // execute EGP script
  const script = EGP_execute_script(parsing_data_path, EGP_run_script_path, type, gaz, options.locality)

  // parse EGP results
  const { stdout, stderr } = await exec(script)
  if (stderr) { console.log('_parseEGP error: ', stderr) }
  if (stdout) {
    // parse xml
    parseString(stdout, function (err, result) {
      if (err) { console.error('ERROR: ', err) }
      if (result.document.standoff[0].ents[0].ent) {
        references = result.document.standoff[0].ents[0].ent
        .map(entity => {
          return {
            string: entity.parts.map(part => part.part[0]._),
            geonames_id: entity.$.gazref.substring(9)
          }
        })
        .filter(el => el.geonames_id != null && el != '' && el != undefined)

      }
    })
  }

  return references
}

const _parseMordecai = async (record, value, options) => {

  try {

    const route = 'mordecai'

    // create a document from text
    const results = await pythonClient(route, value, options)

    if(results) { return JSON.stringify(results) }

  } catch (error) { console.log(`_nlp_parse error: ${error}`) }

}

const containsPlacenames = async(record, value, options) => {
  const references = {
    egp: {},
    mordecai: {}
  }
  // geoparse using the Edinburgh geoparser
  references.egp = await _parseEGP(record, value, options)

  // geoparse using the mordecai geoparser
  references.mordecai = await _parseMordecai(record, value, options)


  return references
}

module.exports = containsPlacenames