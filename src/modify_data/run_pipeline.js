const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

const { sql } = require('../models/totalSearchUniques')
const joinModel = require('../models/openData_placenames')
const { cleanValue, iterateDocs, containsCoords, containsAddress, containsPlacenames, updateValue } = require('../utils')

// options.database.where[options.database.columnName] = '*concrete' // TODO: remove example
options.database.where[options.database.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
// options.database.where[options.database.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example



const _geoProcess = async (Model, record, options) => {
  const updates = {}

  // NOTE: **the record is a model, therefore we don't need 'MODEL'

  try {

    // get original value of interest
    const original_record_value = record[options.database.columnName]

    // clean value
    updates.cleaned = cleanValue(original_record_value)

    // check if element contains coords
    updates.containsCoords = containsCoords(original_record_value)

    // check if element contains address
    updates.containsAddress = containsAddress(original_record_value)

    // check if elements contains place names
    updates.placenames = await containsPlacenames(record, options)

    console.log(updates)

    // NOTE: if localizing, get hostname for total_search_uniques, or just do it for refinement

    // updateValue(Model, original_record_value, updates, options) // TODO: update values (the middle corresponding table)

  } catch (err) { console.log(`geoProcess Error: ${err}`) }

}

// NOTE: figure out if I should run the pipeline for total_search_uniques first
const runPipeline = async (model, callback, options) => {
  try {
    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // create models
    const Model = await model.createModel(sequelize, model.columns)
    Model.sync()

    const JoinModel = await joinModel.sql.createModel(sequelize, joinModel.sql.columns)
    options.joinModel = JoinModel
    JoinModel.sync()

    // TODO: create other model and use it to update placenames

    // iterate model docs & apply callback
    await iterateDocs(Model, callback, options)


  } catch (error) {
    console.log(`runPipeline error: ${error}`)
  }
}

runPipeline(sql, _geoProcess, options)