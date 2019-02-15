const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

// const { sql } = require('../models/totalSearchUniques') // TODO: if there are issues with using refinements, go back to totalSearchUniques
const refinementsModel = require('../models/searchRefinements')
const placenameModel = require('../models/openData_placenames')

const { cleanValue, iterateDocs, containsCoords, containsAddress, containsPlacenames, updateValue } = require('../utils')

// options.database.where[options.database.columnName] = '*concrete' // TODO: remove example
// options.database.where[options.database.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
options.database.where[options.database.columnName] = '(d) 16515 Mojave Dr., Victorville, CA 92395'
// options.database.where[options.database.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example


// NOTE: **the record is a model, therefore we don't need to use 'MODEL'
const _geoProcess = async (Model, record, options) => {

  const updates = {}

  try {

    // get searchKeyword value
    const searchKeyword_value = record[options.database.columnName]

    // clean value
    updates.cleaned_searchKeyword = cleanValue(searchKeyword_value)

    // check if element contains coords
    updates.containsCoords = containsCoords(updates.cleaned_searchKeyword)

    // check if element contains address
    updates.containsAddress = containsAddress(updates.cleaned_searchKeyword)

    // check if elements contains place names
    updates.placenames = await containsPlacenames(cleaned_searchKeyword, options, record)

    // ** repeat steps for refinement ** //

    // get searchRefinement value
    const searchRefinement_value = record[options.database.refinementColumnName]

    // clean value
    updates.cleaned_refinement = cleanValue(searchRefinement_value)

    // check if element contains coords
    updates.containsCoords_refinement = containsCoords(updates.cleaned_refinement)

    // check if element contains address
    updates.containsAddress_refinement = containsAddress(updates.cleaned_refinement)

    // check if elements contains place names
    updates.placenames_refinement = await containsPlacenames(cleaned_refinement, options, record)


    // NOTE: if localizing, get hostname for total_search_uniques, or just do it for refinement

    // updateValue(Model, searchKeyword_value, updates, options) // TODO: update values (the middle corresponding table)

  } catch (err) { console.log(`geoProcess Error: ${err}`) }

}

// NOTE: figure out if I should run the pipeline for total_search_uniques first
const runPipeline = async (model, callback, options) => {
  try {

    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // create models
    const Model = await model.sql.createModel(sequelize, model.sql.columns)
    Model.sync()

    const PlacenameModel = await placenameModel.sql.createModel(sequelize, placenameModel.sql.columns)
    options.placenameModel = PlacenameModel
    PlacenameModel.sync()

    // iterate model docs & apply callback
    await iterateDocs(Model, callback, options)


  } catch (error) {
    console.log(`runPipeline error: ${error}`)
  }
}

runPipeline(refinementsModel, _geoProcess, options)