const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')

const { sql } = require('../models/totalSearchUniques')
const { cleanValue, iterateDocs, containsCoords, containsAddress, containsPlacenames, updateValue } = require('../utils')

const options = {
  columnName: 'dimension_searchKeyword',
  where: {}
}

options.where[options.columnName] = '*1197 Peachtree Streeet NE, Ste. 502, Atlanta, GA 30361' // TODO: remove example

// options.where[options.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example

const geoProcess = async (Model, element, options) => {
  const updates = {}

  try {

    // get original value of interest
    const original_element = element[options.columnName]

    // // clean value
    // updates.cleaned = cleanValue(original_element)

    // // check if element contains coords
    // updates.containsCoords = containsCoords(original_element)

    // // check if element contains address
    // updates.containsAddress = containsAddress(original_element)

    // check if elements contains place names
    updates.placenames = containsPlacenames(original_element)

    // updateValue(Model, original_element, updates, options)

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