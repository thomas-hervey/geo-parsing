const fs = require('fs')
var exec = require('child-process-promise').exec
var sanitize = require("sanitize-filename")

const { parsing_data } = require('../config')

const options = {
  inputFile: '',
  script: '/scripts/run',
  type: 'plain',
  gaz: 'geonames' // TODO: update to geonames-local once working
}

const _parseEGP = async input => {
  // create a temporary .txt file of input
  options.inputFile = parsing_data.parsing_data_path + 'temp.txt'
  fs.writeFile(options.inputFile, input, err => {
    if (err) { console.log(`_parseEGP fs.writeFile error: ${err}`) }

    console.log("The file was saved!")
  })

  // run parser on file
  const { inputFile, script, type, gaz } = options
  await exec(parsing_data.EGP_script(inputFile, parsing_data.EGP_path + script, type, gaz))
    .then(result => {
        var stdout = result.stdout
        var stderr = result.stderr
        console.log('stdout: ', stdout)
        console.log('stderr: ', stderr)
    })
    .catch(err => { console.error('ERROR: ', err) })

  // TODO: read result

  // // delete temporary input file
  // fs.unlink(options.inputFile, err => {
  //   if (err) { console.log(`_parseEGP fs.unlink error: ${err}`) }

  //   console.log('path/file.txt was deleted')
  // })

  return // TODO: return result
}


const containsPlacenames = input => {
  let placenames = []

  // parse input using Edinburgh geoparser
  placenames.push(_parseEGP(input))

  // TODO: parse input using mordecai


  return placenames
}

module.exports = containsPlacenames