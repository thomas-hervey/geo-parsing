const axios = require('axios')

const baseurl = 'https://hub.arcgis.com/api/v3/datasets/'
const org = '/org'

const getSiteOrg = async (siteId) => {
  try {
    const siteOrgUrl = `${baseurl}${siteId}${org}`
    const res = await axios(siteOrgUrl)
    return res
  } catch (error) { console.log(`getSiteOrgExtent error: ${error}`) }
}

module.exports = getSiteOrg