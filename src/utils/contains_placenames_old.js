const fs = require('fs').promises
var exec = require('child-process-promise').exec
var sanitize = require('sanitize-filename')
var { parseString } = require('xml2js')

const spawn = require("child_process").spawn

let options = {}
let geoparsing = ''

const _createTempFile = async record => {
  try {
    const input = record[options.database.columnName]
    const { parsing_data_path } = geoparsing

    // create a temporary .txt file of input
    await fs.writeFile(parsing_data_path, input)
  } catch (err) { console.error('_createTempFile error: ', err) }
}

const _parseEGP = async () => {
  let references = []

  // run parser on file
  const { parsing_data_path } = geoparsing
  const { EGP_execute_script, EGP_run_script_path, type, gaz } = geoparsing.EGP

  try {
    const script = EGP_execute_script(parsing_data_path, EGP_run_script_path, type, gaz)
    exec(script) // TODO: for refinement, getLocality(record.host)
      .then(result => {
        var { stdout } = result
        if (stdout) {
          // parse xml response
          parseString(stdout, function (err, result) {
            if (err) { console.error('ERROR: ', err) }
            if (result.document.standoff[0].ents[0].ent) {
              const refs = result.document.standoff[0].ents[0].ent
              .map(entity => entity.$.gazref)
              .filter(el => el != null)

              references.push(refs) // TODO: Important* figure out why some words, like Atlanta aren't geoparsed
            }
          })
        }
      })
      .catch(err => { console.log('_parseEGP exec error: ', err) })
  } catch (err) { console.error('_parseEGP exec error (outside): ', err) }

  // strip 'geonames:' out of references
  if (references.length) { references = references[0].map(ref => parseInt(ref.substring(9))) }

  return references
}


const _parseMordecai = async () => {
  // read input string
  const input_path = '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/geoparsing/parsing_data/temp.txt'
  fs.readFile(input_path, "utf8", function(err, data) {
    if (err) { console.log('_parseMordecai readFile error: ', err)}
    const input_text = data

    const mordecai_exec_path = '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/utils/mordecai_exec.py'

    var uint8arrayToString = function(data){
      return String.fromCharCode.apply(null, data)
    }

    const pythonProcess = spawn('python',[mordecai_exec_path, input_text])
    pythonProcess.stdout.on('data', (data) => {
      console.log('python process output', uint8arrayToString(data))
    })
    pythonProcess.stderr.on('data', (data) => {
      console.error(`child stderr:\n${data}`);
    });

  })
}


const containsPlacenames = async (record, inputOptions) => {
  options = inputOptions
  geoparsing = options.geoparsing

  // create temp file for parsing
  // _createTempFile(record)


  const input = record[options.database.columnName]
  const { parsing_data_path } = geoparsing

  // create a temporary .txt file of input
  await fs.writeFile(parsing_data_path, input)

  let placenames = []

  // parse input using Edinburgh geoparser
  placenames.push(await _parseEGP())

  // parse input using mordecai
  // placenames.push(await _parseMordecai()) // TODO: add another geoparser if desirable

  console.log('placenames: ', placenames, ': yeah')
  // return placenames
}

module.exports = containsPlacenames