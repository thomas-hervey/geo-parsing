const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')

const { sql } = require('../models/totalSearchUniques')
const { cleanValue, iterateDocs, isCoords, isAddress, containsPlacenames } = require('../utils')

const options = {
  inputString: 'dimension_searchKeyword'
}

const geoProcess = (element) => {
  let element = element[options.inputString]

  // clean input
  element = cleanValue(element)

  // check if element contains coords
  const coords = isCoords(element)

  // check if element contains address
  const address = isAddress(element)

  // check if elements contains place names
  const placenames = containsPlacenames(element)

}

const runPipeline = async (model, callback) => {
  try {
    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // create model
    const Model = await model.createModel(sequelize, model.columns)
    Model.sync()


    // iterate model
    await iterateDocs(Model, callback)


  } catch (error) {
    console.log(`pushToDB error: ${error}`)
  }
}

runPipeline(sql, geoProcess)