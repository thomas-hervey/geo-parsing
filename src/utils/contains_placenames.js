const fs = require('fs').promises
var exec = require('child-process-promise').exec
const sanitize = require('sanitize-filename')
const { parseString } = require('xml2js')

const spawn = require("child-process-promise").spawn

let record = {}
let value = ''
let options = {}

const _getSiteCentroid = (record) => {
  // NOTE: TODO: I have to figure out how to pick a site, since giving an orgId gives multiple sites. I can pick the top, but this seems risky
  SiteModel.findOne({
    attributes: ['centroid'],
    where
  })
}

const _parseEGP = async () => {

  let references = []

  const { parsing_data_path } = options.geoparsing
  const { EGP_execute_script, EGP_run_script_path, type, gaz } = options.geoparsing.EGP


  // ************************************* //
  // create temporary file for EGP to read //
  // ************************************* //
  await fs.writeFile(parsing_data_path, value)


  // ****************** //
  // run parser on file
  // ****************** //

  // add associated locality, if it exists
  if (record.hostname) {
    // check if there's an associated domain
    await options.CompositeModel.find({
      domain_hostname: record.hostname
    })
    .then(res => {
      console.log(res)
    })

    return
    // TODO: check if there is a locality associated with the hostname (e.g., by joining domain table to site table)
    const site_centroid = _getSiteCentroid(record)


    // TODO: if not, check if there is a locality from an org that is associated with a domain & site (as a fallback)
    const org_centroid = _getOrgCentroid(record)
  }

  const script = EGP_execute_script(parsing_data_path, EGP_run_script_path, type, gaz, locality = undefined)

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

const containsPlacenames = async(inputRecord, inputValue, inputOptions) => {
  // updating global vars (although not best practice)
  record = inputRecord
  value = _.cloneDeep(inputValue)
  options = _.cloneDeep(inputOptions)

  const references = await _parseEGP()
  return references
}

module.exports = containsPlacenames