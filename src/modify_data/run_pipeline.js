const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

// const { sql } = require('../models/totalSearchUniques') // TODO: if there are issues with using refinements, go back to totalSearchUniques
const refinementsModel = require('../models/searchRefinements')
const domainsModel = require('../models/openData_domains')
const sitesModel = require('../models/openData_sites')
const orgsModel = require('../models/openData_orgs')
const placenameModel = require('../models/openData_placenames')
const parsedTextModel = require('../models/openData_parsed_text')

const { cleanValue, iterateDocs, containsCoords, containsAddress, containsPlacenames, updateValue, calculateCentroid } = require('../utils')

const RADIUS_BUFFER = 200 // additional buffer to radius search area

// options.database.where[options.database.columnName] = '*concrete' // TODO: remove example
// options.database.where[options.database.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
options.database.where[options.database.columnName] = '(d) 16515 Mojave Dr., Victorville, CA 92395'
// options.database.where[options.database.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example


const _alreadyParsed = (keyword, refinement) => {
  parsedTextModel
}

// NOTE: **the record is a model, therefore we don't need to use 'MODEL'
const _geoProcess = async (Model, record, options) => {

  const updates = {}

  try {

    // get searchKeyword value
    const searchKeyword_value = record[options.database.columnName]

    // get searchRefinement value
    const searchRefinement_value = record[options.database.refinementColumnName]

    // if keyword or refinement text have already been parsed, skip
    if(!_alreadyParsed(searchKeyword_value, searchRefinement_value)) {


      // clean value
      updates.cleaned_searchKeyword = cleanValue(searchKeyword_value)

      // check if element contains coords
      updates.containsCoords = containsCoords(updates.cleaned_searchKeyword)

      // check if element contains address
      updates.containsAddress = containsAddress(updates.cleaned_searchKeyword)

      // check if elements contains place names
      updates.placenames = await containsPlacenames(cleaned_searchKeyword, options, record)

      // *************************** //
      // repeat steps for refinement //
      // *************************** //

      // clean value
      updates.cleaned_refinement = cleanValue(searchRefinement_value)

      // check if element contains coords
      updates.containsCoords_refinement = containsCoords(updates.cleaned_refinement)

      // check if element contains address
      updates.containsAddress_refinement = await containsAddress(updates.cleaned_refinement)

      // check if elements contains place names
      updates.placenames_refinement = await containsPlacenames(cleaned_refinement, options, record)


      // NOTE: if localizing, get hostname for total_search_uniques, or just do it for refinement

      // updateValue(Model, searchKeyword_value, updates, options) // TODO: update values (the middle corresponding table)

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
    // const RefinementsModel = await refinementsModel.sql.createModel(sequelize, refinementsModel.sql.columns, refinementsModel.sql.table_name)
    // RefinementsModel.sync()

    // // `openData_domains`
    // const DomainsModel = await domainsModel.sql.createModel(sequelize, domainsModel.sql.columns, domainsModel.sql.table_name)
    // options.domainsModel = DomainsModel
    // DomainsModel.sync()

    // // `openData_sites`
    // const SitesModel = await sitesModel.sql.createModel(sequelize, sitesModel.sql.columns, sitesModel.sql.table_name)
    // // options.sitesModel = SitesModel
    // SitesModel.sync()

    // `openData_orgs`
    const OrgsModel = await orgsModel.sql.createModel(sequelize, orgsModel.sql.columns, orgsModel.sql.table_name)
    // options.orgsModel = OrgsModel
    OrgsModel.sync()

    // // `openData_placenames`
    // const PlacenameModel = await placenameModel.sql.createModel(sequelize, placenameModel.sql.columns, placenameModel.sql.table_name)
    // options.placenameModel = PlacenameModel
    // PlacenameModel.sync()

    // // `openData_parsed_text`
    // const ParsedTextModel = await parsedTextModel.sql.createModel(sequelize, parsedTextModel.sql.columns, parsedTextModel.sql.table_name)
    // options.parsedTextModel = ParsedTextModel
    // ParsedTextModel.sync()

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


    // iterate model docs & apply callback
    await iterateDocs(OrgsModel, callback, options) // TODO: uncomment when ready


  } catch (error) {
    console.log(`runPipeline error: ${error}`)
  }
}

// runPipeline(_geoProcess, options)
runPipeline(_calculateSiteCentroids, {})