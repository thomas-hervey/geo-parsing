const fs = require('fs').promises
var exec = require('child-process-promise').exec
const sanitize = require('sanitize-filename')
const { parseString } = require('xml2js')

const spawn = require("child-process-promise").spawn

const _getCenter = (res) => {
  let center = {}
  let centerFound = false
  let i = 0
  while (res[i] && !centerFound) { // NOTE: the first row where a center is found will be used

    // check if there is a site center
    const siteCenter = res[i].dataValues.site_center_lon
    center = {
      center_lon: res[i].dataValues.site_center_lon,
      center_lat: res[i].dataValues.site_center_lat,
      center_radius: res[i].dataValues.site_center_radius
    }
    centerFound = true

    // if not a site center, check if there is an org center
    if (!siteCenter) {
      const orgCenter = res[i].dataValues.org_center_lon
      center = {
        center_lon: res[i].dataValues.org_center_lon,
        center_lat: res[i].dataValues.org_center_lat,
        center_radius: res[i].dataValues.org_center_radius
      }
      centerFound = true
    }
  }
  return center
}

const _parseEGP = async (record, value, options) => {

  let references = []
  let locality = null

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
  if (record.dataValues.dimension_hostname) {
    // check if there are associated domains
    const res = await options.CompositeModel.findAll({
      where: {
        domain_hostname: record.dataValues.dimension_hostname
      }
    })
    // if there's associated domains, get a center (retrieving the first success)
    if (res) { locality = _getCenter(res) }
  }

  const script = EGP_execute_script(parsing_data_path, EGP_run_script_path, type, gaz, locality)

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

const containsPlacenames = async(record, value, options) => {
  const references = await _parseEGP(record, value, options)
  return references
}

module.exports = containsPlacenames