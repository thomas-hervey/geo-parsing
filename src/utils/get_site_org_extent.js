const axios = require('axios')

const baseurl = 'https://hub.arcgis.com/api/v3/datasets/'
const org = '/org'

const getSiteOrgExtent = async (siteId) => {
  try {
    const siteOrgUrl = `${baseurl}${siteId}${org}`
    const res = await axios(siteOrgUrl)

    if (res.data && res.data.attributes && res.data.attributes.defaultExtent) {
      return res.data.attributes.defaultExtent
    }
    return 'no_extent found for ${siteId}'
  } catch (error) { console.log(`getSiteOrgExtent error: ${error}`) }
}

module.exports = getSiteOrgExtent