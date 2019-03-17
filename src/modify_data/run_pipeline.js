const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

// const { sql } = require('../models/totalSearchUniques') // NOTE: if there are issues with using refinements, go back to totalSearchUniques
const refinementsModel = require('../models/searchRefinements')
const compositeModel = require('../models/openData_composite')
const placenameModel = require('../models/openData_placenames')
// const hasBeenParsedModel = require('../models/openData_parsed_searchKeyword')
const parsedSearchKeywordModel = require('../models/openData_parsed_searchKeyword')
const parsedSearchRefinementModel = require('../models/openData_parsed_searchRefinement')

const { cleanValue, iterateDocs, containsCoords, containsAddress, containsPlacenames, updateValue, calculateCentroid } = require('../utils')

// options.database.where[options.database.columnName] = '*concrete' // TODO: remove example
// options.database.where[options.database.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
// options.database.where[options.database.columnName] = '(d) 16515 Mojave Dr., Victorville, CA 92395'
// options.database.where[options.database.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example


const _alreadyParsed = async (value, options) => {
  let alreadyParsed = false

  // check if searchKeyword has been parsed already
  const hasBeenParsed = await options.HasBeenParsedModel.find({
    where: {
      parsed_text: value
    }
  })
  .then(res => {
    // if it has...
    if (res && res.dataValues && res.dataValues.id) {

      // get id to later query any placenames already saved
      alreadyParsed = res.dataValues.id

      // and update the counter
      let currCounter = res.dataValues.counter
      await res.update({
        counter: currCounter + 1
      })
      .then(res => {})
      .catch(error => console.log('update parsed text counter error: ', error))
    }
  })
  .catch(error => console.log('find parsed text error: ', error))

  return alreadyParsed
}

const _checkForPlacenames = async (id, options) => {
  let placenamesFound = false

  //if placenames exist, return them to be updated
  const existingPlacenames = await options.PlacenameModel.findAll({
    where: {
      openData_id: id
    }
  })
  .then(res => {
    if (res && res.length >=1 && res[0].dataValues) {

      placenamesFound = res
    }
  })
  .catch(error => console.log('find placename error: ', error))

  return placenamesFound
}

const _copyPlacenames = async (id, placenames) => {

}


const _geoProcess = async (Model, record, options) => { // NOTE: **the record is a model, therefore we don't need to use 'MODEL'

  try {

    const parsed_searchKeyword = {}
    const placenames = {}

    // ******************** //
    // parse search keyword //
    // ******************** //

    // get searchKeyword value
    const searchKeyword_value = record[options.database.columnName]

    // clean value
    const cleanedKeyword = cleanValue(searchKeyword_value)

    // check if keyword has already been parsed
    let alreadyParsedID = await _alreadyParsed(cleanedKeyword, options)

    // if keyword has already been parsed, skip
    if(!alreadyParsedID) {

      parsed_searchKeyword.dimension_searchKeyword = cleanedKeyword

      // check if element contains coords
      parsed_searchKeyword.containsCoords = containsCoords(parsed_searchKeyword.dimension_searchKeyword)

      // check if element contains address
      parsed_searchKeyword.containsAddress = await containsAddress(parsed_searchKeyword.dimension_searchKeyword)

      // if coords & addresses aren't present check if elements contains place names
      if (!(parsed_searchKeyword.containsCoords) && parsed_searchKeyword.containsAddress === 'no_address') {
        placenames.placenames = await containsPlacenames(record, parsed_searchKeyword.dimension_searchKeyword, options)
      }
    }

// TODO: the following
// TODO: then, update update_value. Make sure new values are created instead of updating (parsed, and placenames)
// yes:
// skip write to T2, get 'first_found_id' from T2, findAll from T3 using it,
// check if same domain. yes?: duplicate with new id
// no?: rerun EGP

    else {
      // if the text has been parsed, check if placenames were saved
      const existingPlacenames = await _checkForPlacenames(alreadyParsedID, options)
      // check if placenames exist
      if (existingPlacenames) {
        // if domains are the same
        if (record.domain === existingPlacenames[0].dataValues.domain) {
          // duplicate with new id
          _copyPlacenames(record.id, existingPlacenames)
        } else {
          // otherwise, rerun parser
          // TODO: rerun parser & then somehow save results (either here or in updateValue)
        }
      }
    }


    // *************************** //
    // repeat steps for refinement //
    // *************************** //

    // get searchRefinement value
    const searchRefinement_value = record[options.database.refinementColumnName]

    // clean value
    const cleanedRefinement = cleanValue(searchRefinement_value)

   // check if keyword refinement has already been parsed
    alreadyParsed = await _alreadyParsed(cleanedRefinement, options)

    // if refinement has already been parsed, skip
    if(!alreadyParsed) {

      parsed_searchRefinement.dimension_searchRefinement = cleanedRefinement

      // check if element contains coords
      parsed_searchRefinement.containsCoords_refinement = containsCoords(parsed_searchRefinement.dimension_searchRefinement)

      // check if element contains address
      parsed_searchRefinement.containsAddress_refinement = await containsAddress(parsed_searchRefinement.dimension_searchRefinement)

      parsed_searchRefinement.counter = 1

      // if coords & addresses aren't present check if elements contains place names
      if (!(parsed_searchRefinement.containsCoords_refinement) && parsed_searchRefinement.containsAddress_refinement === 'no_address') {
        placenames.placenames_refinement = await containsPlacenames(record, parsed_searchRefinement.dimension_searchRefinement, options)
      }
    }

    // if both keyword and refinement haven't been parsed, update
    if (!alreadyParsedID && !alreadyParsedID_refinement) {
      const updates = {
        parsed_searchKeyword,
        parsed_searchRefinement,
        placenames
      }

      options.updates = updates

      // save record with updates
      await updateValue(record, options) // TODO: update values (the middle corresponding table)
    }

  } catch (err) { console.log(`geoProcess Error: ${err}`) }

}

// NOTE: figure out if I should run the pipeline for total_search_uniques first
const runPipeline = async (callback, options) => {
  try {

    // create connection to SQL database
    const sequelize = await sql_connection(db_config)

    // ************* //
    // create models //
    // ************* //

    // `search_refinements`
    const RefinementModel = await refinementsModel.sql.createModel(sequelize, refinementsModel.sql.columns, refinementsModel.sql.table_name)
    options.RefinementModel = RefinementModel
    options.modelToIterate = RefinementModel
    RefinementModel.sync()

    // `OpenData_composite`
    const CompositeModel = await compositeModel.sql.createModel(sequelize, compositeModel.sql.columns, compositeModel.sql.table_name)
    options.CompositeModel = CompositeModel
    CompositeModel.sync()

    // `openData_placenames`
    const PlacenameModel = await placenameModel.sql.createModel(sequelize, placenameModel.sql.columns, placenameModel.sql.table_name)
    options.PlacenameModel = PlacenameModel
    PlacenameModel.sync()

    // // `openData_parsed_text`
    // const HasBeenParsedModel = await hasBeenParsedModel.sql.createModel(sequelize, hasBeenParsedModel.sql.columns, hasBeenParsedModel.sql.table_name)
    // options.HasBeenParsedModel = HasBeenParsedModel
    // HasBeenParsedModel.sync()

    const ParsedSearchKeywordModel = await parsedSearchKeywordModel.sql.createModel(sequelize, parsedSearchKeywordModel.sql.columns, parsedSearchKeywordModel.sql.table_name)
    options.ParsedSearchKeywordModel = ParsedSearchKeywordModel
    ParsedSearchKeywordModel.sync()

    const ParsedSearchRefinementModel = await parsedSearchRefinementModel.sql.createModel(sequelize, parsedSearchRefinementModel.sql.columns, parsedSearchRefinementModel.sql.table_name)
    options.ParsedSearchRefinementModel = ParsedSearchRefinementModel
    ParsedSearchRefinementModel.sync()

    // iterate model docs & apply callback
    await iterateDocs(options.modelToIterate, callback, options)


  } catch (error) {
    console.log(`runPipeline error: ${error}`)
  }
}

runPipeline(_geoProcess, options)




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