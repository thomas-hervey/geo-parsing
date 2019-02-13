const fs = require('fs').promises
var exec = require('child-process-promise').exec
const sanitize = require('sanitize-filename')
const { parseString } = require('xml2js')

const spawn = require("child-process-promise").spawn

let options = {}
let geoparsing = ''
const mordecai_exec_path = '/Users/thomashervey/Projects/academic/graduate/PhD/Query_Logs/Geo-parsing/src/utils/mordecai_exec.py'

const _parseEGP = async () => {
  let references = []

  // run parser on file
  const { parsing_data_path } = geoparsing
  const { EGP_execute_script, EGP_run_script_path, type, gaz } = geoparsing.EGP
  const script = EGP_execute_script(parsing_data_path, EGP_run_script_path, type, gaz)

  const { stdout, stderr } = await exec(script)
  if (stderr) { console.log('_parseEGP error: ', stderr) }
  if (stdout) {
    // parse xml response
    parseString(stdout, function (err, result) {
      if (err) { console.error('ERROR: ', err) }
      if (result.document.standoff[0].ents[0].ent) {
        const refs = result.document.standoff[0].ents[0].ent
        .map(entity => entity.$.gazref)
        .filter(el => el != null && el != '' && el != undefined)

        references.push(refs) // TODO: Important* figure out why some words, like Atlanta aren't geoparsed
      }
    })
  }

  if (references.length) { references = references[0].map(ref => parseInt(ref.substring(9))) }
  return references
}

const _parseMordecai = async () => {
  // read input string
  const { parsing_data_path } = geoparsing

  const fileString = await fs.readFile(parsing_data_path, "utf8")

  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data)
  }

  const promise = spawn('python',[mordecai_exec_path, fileString])

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

const containsPlacenames = async(record, inputOptions) => {
  options = inputOptions
  geoparsing = options.geoparsing

  // create temporary file for EGP to read
  const input = record[options.database.columnName]
  const { parsing_data_path } = geoparsing
  await fs.writeFile(parsing_data_path, input)

  return _parseEGP()

  // const parsers = [_parseEGP]

  // let references

  // // run parsers
  // parsers.forEach(async parser => {
  //   references += await parser()
  // })

  // console.log(references)
  // return references
}

module.exports = containsPlacenames