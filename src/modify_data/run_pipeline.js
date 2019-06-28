const sql_connection = require('../sql/sql_connection.js')
const db_config = require('../sql/db_config')
let { options } =require('../config.js')

const createModelsForPipeline = require('../models/QueryLogs/create_models_for_pipeline')

const parseRecord = require('./parseRecord')
const { cleanRecord } = require('./cleanRecords')

const { iterateDocs } = require('../utils')

// options.table[options.table.columnName] = '*concrete' // TODO: remove example
// options.table[options.table.columnName] = '- 815 Connecticut Avenue, Washington, DC 20006' // TODO: remove example
// options.table[options.table.columnName] = '(d) 16515 Mojave Dr., Victorville, CA 92395'
// options.table[options.table.columnName] = '-84.075,42.03,-83.911,42.068' // TODO: remove example

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