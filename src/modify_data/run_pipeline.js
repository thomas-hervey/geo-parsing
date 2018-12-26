const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')

const { sql } = require('../models/totalSearchUniques')
const { cleanValue, iterateDocs, isCoords, isAddress, containsPlacenames, updateValue } = require('../utils')

const options = {
  inputString: 'dimension_searchKeyword',
  where: {}
}

options.where[options.inputString] = '*1197 Peachtree Streeet NE, Ste. 502, Atlanta, GA 30361' // TODO: remove example

const geoProcess = async (Model, element, options) => {
  try {

    // get value
    const element_value = element[options.inputString]

    // clean value
    const element_cleaned = cleanValue(element_value)

    // // check if element contains coords
    // const coords = isCoords(element)

    // // check if element contains address
    // const address = isAddress(element)

    // // check if elements contains place names
    // const placenames = containsPlacenames(element)

    updateValue(element_value, element_cleaned, options)

  } catch (err) {
    console.log(`geoProcess Error: ${err}`)
  }

}

const runPipeline = async (model, callback) => {
  try {
    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // create model
    const Model = await model.createModel(sequelize, model.columns)
    Model.sync()


    // iterate model docs & apply callback
    await iterateDocs(Model, callback, options)


  } catch (error) {
    console.log(`runPipeline error: ${error}`)
  }
}

runPipeline(sql, geoProcess)