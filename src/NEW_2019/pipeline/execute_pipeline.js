// const sql_connection = require('../sql/sql_connection.js')
// let { options } =require('../config.js')

// const createModelsForPipeline = require('../models/QueryLogs/create_models_for_pipeline')

// const parseRecord = require('./parseRecord')
// const { cleanRecords } = require('./cleanRecords')

// const { iterateDocs } = require('../utils')


// const runPipeline = async (callback, opts) => {
//   try {

//     // create connection to SQL database
//     const sequelize = await sql_connection(opts)

//     // create models and save references in options
//     opts = await createModelsForPipeline(sequelize, opts)

//     // iterate model docs & apply callback
//     await iterateDocs(opts.modelToIterate, callback, opts)

//   } catch (error) {
//     console.log(`runPipeline error: ${error}`)
//   }
// }

// // initializePipeline(parseRecord, options)
// runPipeline(parseRecord, options)


const config = require('../config')
const { connect } = require('./connect')

const initialize = async (options) => {
  try {

    // connect to db
    const { db, pool, client } = await connect(options.credentials)

    console.log('client: ', client)
  } catch (error) { console.log(`'initialize()' error: ${error}`) }
}


const executePipeline = async (callback, options) => {
  try {

    // initialize
    const init = await initialize(options);

  } catch (error) { console.log(`'executePipeline()' error: ${error}`) }

  // process.exit();

  // NOTE: don't work on this until my data is ready in a psql database
}

executePipeline(null, config) // TODO: remove once finished pipeline


module.exports = { executePipeline }