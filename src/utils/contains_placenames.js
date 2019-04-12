const fs = require('fs').promises
var exec = require('child-process-promise').exec
const sanitize = require('sanitize-filename')
const { parseString } = require('xml2js')
const { getLocality } = require('./get_locality')

const spawn = require("child-process-promise").spawn

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

const _parseMordecai = async () => {
  // read input string
  const { parsing_data_path } = geoparsing

  const fileString = await fs.readFile(parsing_data_path, "utf8")

  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data)
  }

  const promise = spawn('python',[options.geoparsing.mordecai.mordecai_path, fileString])

  var childProcess = promise.childProcess;
  childProcess.stdout.on('data', (data) => {
    console.log('python process output', uint8arrayToString(data))
  })
  childProcess.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`)
  })

  promise.then(() => {
    console.log('after python process')
  })
}

const containsPlacenames = async(record, value, options) => {
  // geoparse using the Edinburgh geoparser
  const references = await _parseEGP(record, value, options)
  return references
}

module.exports = containsPlacenames