const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

// const { sql } = require('../models/totalSearchUniques') // NOTE: if there are issues with using refinements, go back to totalSearchUniques
const createModelsForPipeline = require('../models/QueryLogs/create_models_for_pipeline')

const parseRecord = require('./parseRecord')
const { cleanRecord } = require('./cleanRecords')

const {
  alreadyParsed,
  checkForPlacenames,
  copyPlacenames,
  cleanValue,
  iterateDocs,
  containsCoords,
  containsAddress,
  containsPlacenames,
  updateValue,
  calculateCentroid
} = require('../utils')

// options.table.table[options.database.columnName] = '*concrete' // TODO: remove example
// options.table.table[options.database.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
// options.table.table[options.database.columnName] = '(d) 16515 Mojave Dr., Victorville, CA 92395'
// options.table.table[options.database.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example


const _geoProcess = async (record, options) => { // NOTE: **the record is a model, therefore we don't need to use 'MODEL'

  try {

    const parsed_searchKeyword = {}
    const parsed_searchRefinement = {}
    const placenames = {}

    // ******************** //
    // parse search keyword //
    // ******************** //

    // get searchKeyword value
    const searchKeyword_value = record[options.table.columnName]

    // clean value
    const cleanedKeyword = cleanValue(searchKeyword_value)

    // check if keyword has already been parsed
    let alreadyParsedID = await alreadyParsed(cleanedKeyword, options.ParsedSearchKeywordModel)

    // if keyword has already been parsed, skip
    if(!alreadyParsedID) {

      parsed_searchKeyword.dimension_searchKeyword = cleanedKeyword

      // check if element contains coords
      parsed_searchKeyword.containsCoords = containsCoords(parsed_searchKeyword.dimension_searchKeyword)

      // check if element contains address
      parsed_searchKeyword.containsAddress = await containsAddress(parsed_searchKeyword.dimension_searchKeyword)

      // if coords & addresses aren't present check if elements contains place names
      if (!parsed_searchKeyword.containsCoords) {
        placenames.placenames = await containsPlacenames(record, parsed_searchKeyword.dimension_searchKeyword, options)
      }
    }

    else {
      // if the text has been parsed, check if placenames were saved
      const existingPlacenames = await checkForPlacenames(alreadyParsedID, options)
      // check if placenames exist
      if (existingPlacenames) {
        // if domains are the same
        if (record.dataValues.dimension_hostname === existingPlacenames[0].dataValues.dimension_hostname) {
          // duplicate with new id
          await copyPlacenames(record.dataValues.id, existingPlacenames, options)
        } else {
          // otherwise, rerun parser
          placenames.placenames = await containsPlacenames(record, parsed_searchKeyword.dimension_searchKeyword, options)
        }
      }
    }

    // *************************** //
    // repeat steps for refinement //
    // *************************** //

    // get searchRefinement value
    const searchRefinement_value = record[options.table.refinementColumnName]

    // clean value
    const cleanedRefinement = cleanValue(searchRefinement_value)

   // check if keyword refinement has already been parsed
   const alreadyParsedID_refinement = await alreadyParsed(cleanedRefinement, options.ParsedSearchRefinementModel)

    // if refinement has already been parsed, skip
    if(!alreadyParsedID_refinement) {

      parsed_searchRefinement.dimension_searchRefinement = cleanedRefinement

      // check if element contains coords
      parsed_searchRefinement.containsCoords_refinement = containsCoords(parsed_searchRefinement.dimension_searchRefinement)

      // check if element contains address
      parsed_searchRefinement.containsAddress_refinement = await containsAddress(parsed_searchRefinement.dimension_searchRefinement)

      parsed_searchRefinement.counter = 1

      // if coords & addresses aren't present check if elements contains place names
      if (!parsed_searchRefinement.containsCoords_refinement) {
        placenames.placenames_refinement = await containsPlacenames(record, parsed_searchRefinement.dimension_searchRefinement, options)
      }
    }
    else {
      // if the text has been parsed, check if placenames were saved
      const existingPlacenames_refinements = await checkForPlacenames(alreadyParsedID, options)
      // check if placenames exist
      if (existingPlacenames_refinements) {
        // if domains are the same
        if (record.dataValues.dimension_hostname === existingPlacenames_refinements[0].dataValues.dimension_hostname) {
          // duplicate with new id
          await copyPlacenames(record.dataValues.id, existingPlacenames_refinements, options)
        } else {
          // otherwise, rerun parser
          placenames.placenames_refinement = await containsPlacenames(record, parsed_searchRefinement.dimension_searchRefinement, options)
        }
      }
    }

    // if both keyword and refinement haven't been parsed, update
    if (!alreadyParsedID || !alreadyParsedID_refinement) {
      let updates = {
        parsed_searchKeyword,
        parsed_searchRefinement,
        placenames
      }

      options.updates = updates
      options.domain = record.dataValues.dimension_hostname

      // save record with updates
      await updateValue(record, options) // TODO: update values (the middle corresponding table)
    }

  } catch (err) { console.log(`geoProcess Error: ${err}`) }

}

// NOTE: figure out if I should run the pipeline for total_search_uniques first
const runPipeline = async (callback, opts) => {
  try {

    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // create models and save references in options
    const options = await createModelsForPipeline(sequelize, opts)

    // iterate model docs & apply callback
    await iterateDocs(options.modelToIterate, callback, options)

  } catch (error) {
    console.log(`initializePipeline error: ${error}`)
  }
}

// initializePipeline(parseRecord, options)
runPipeline(cleanRecord, options)




// // `openData_domains`
    // const DomainsModel = await domainsModel.sql.createModel(sequelize, domainsModel.sql.columns, domainsModel.sql.table_name)
    // options.domainsModel = DomainsModel
    // DomainsModel.sync()

    // // `openData_sites`
    // const SitesModel = await sitesModel.sql.createModel(sequelize, sitesModel.sql.columns, sitesModel.sql.table_name)
    // // options.sitesModel = SitesModel
    // SitesModel.sync()

    // // `openData_orgs`
    // const OrgsModel = await orgsModel.sql.createModel(sequelize, orgsModel.sql.columns, orgsModel.sql.table_name)
    // // options.orgsModel = OrgsModel
    // OrgsModel.sync()

    // ************************ //
    // setup model associations //
    // ************************ //
    // RefinementsModel.hasOne(DomainsModel, { foreignKey: 'hostname', sourceKey: 'dimension_hostname' })
    // DomainsModel.belongsTo(RefinementsModel, { foreignKey: 'hostname', targetKey: 'dimension_hostname' })

    // // DomainsModel.hasMany(SitesModel, { foreignKey: 'orgId', sourceKey: 'orgId' })
    // // // SitesModel.belongsTo(DomainsModel, { foreignKey: 'orgId', targetKey: 'orgId' })

    // // DomainsModel.hasOne(OrgsModel, { foreignKey: 'orgId', sourceKey: 'orgId' })
    // // // OrgsModel.belongsTo(DomainsModel, { foreignKey: 'orgId', targetKey: 'orgId' })

    // RefinementsModel.findOne({
    //   where: {
    //     dimension_searchKeyword: 'Index of Place Names'
    //   },
    //   include: [DomainsModel]
    //   // include: [{
    //   //   model: DomainsModel,
    //   //   required: false // to produce a LEFT OUTER JOIN
    //   // }]
    // })
    // .then(res => console.log('results: ', res.dataValues))