// NOTE: this script is used to create an orgs table so that sites w/out extents can use a fallback extent

const sql_connection = require('../sql/sql_connection')
const { options } = require('../config')
const getSiteOrg = require('./get_site_org')
const convertCoords = require('./convert_coords')

const sitesModel = require('../models/openData_sites')
const orgsModel = require('../models/openData_orgs')

const { iterateDocs } = require('../utils')

const options = {
  database: {
    where: {
      ll_lat: null
    }
  }
}

const addressedOrgs = []
let failedOrgs = 0

const _getOrgDetails = (id, name, defaultExtent) => {

  const ll = {
    lon: defaultExtent.xmin,
    lat: defaultExtent.ymin
  }
  const ll_res = convertCoords(ll)
  const ll_lon = ll_res.lon
  const ll_lat = ll_res.lat

  const ur = {
    lon: defaultExtent.xmax,
    lat: defaultExtent.ymax
  }
  const ur_res = convertCoords(ur)
  const ur_lon = ur_res.lon
  const ur_lat = ur_res.lat

  return {
    id,
    name,
    ll_lon,
    ll_lat,
    ur_lon,
    ur_lat
  }
}

const getOrgDetails = async (Model, record, options) => {
  try {
    // and request details on their org
    const siteId = record.id
    const res = await getSiteOrg(siteId)

    if (res && res.data && res.data.attributes && res.data.attributes.defaultExtent) {
      const { id, name, defaultExtent } = res.data.attributes
      if (!addressedOrgs.includes(id)) {
        // get important details
        const org = _getOrgDetails(id, name, defaultExtent)

        // save that org to the db (if it hasn't been saved before
        options.orgsModel.create(org).then(() => {
          console.log(`created sql record`)
        })


        // push orgId to list so it isn't used again
        addressedOrgs.push(org.id)
      }
    } else {
      console.log(`No org found for siteId ${siteId}`)
    }
  } catch (error) {
    console.log(`getOrgDetails error: ${error}`)
    failedOrgs += 1
  }
}

const getOrgs = async (model, callback, options) => {
  try {

    // create connection to SQL database
    const sequelize = await sql_connection(options)

    // create models
    const SitesModel = await sitesModel.sql.createModel(sequelize, sitesModel.sql.columns, sitesModel.sql.table_name)
    SitesModel.sync()

    const orgsModel = await model.sql.createModel(sequelize, model.sql.columns, model.sql.table_name)
    options.orgsModel = orgsModel
    orgsModel.sync()

    // iterate model docs & apply callback
    await iterateDocs(SitesModel, callback, options)

    console.log(`failed orgs = ${failedOrgs}`)

  } catch (error) {
    console.log(`getOrgs error: ${error}`)
  }
}


getOrgs(orgsModel, getOrgDetails, options)