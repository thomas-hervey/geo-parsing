const Sequelize = require('sequelize')
const Op = Sequelize.Op

const getCenter = res => {
  let center = {}
  let centerFound = false
  let i = 0
  while (res[i] && !centerFound) { // NOTE: the first row where a center is found will be used

    // check if there is a site center
    const siteCenter = res[i].dataValues.site_center_lon
    center = {
      center_lon: res[i].dataValues.site_center_lon,
      center_lat: res[i].dataValues.site_center_lat,
      center_radius: res[i].dataValues.site_radius
    }
    centerFound = true

    // if not a site center, check if there is an org center
    if (!siteCenter) {
      const orgCenter = res[i].dataValues.org_center_lon
      center = {
        center_lon: res[i].dataValues.org_center_lon,
        center_lat: res[i].dataValues.org_center_lat,
        center_radius: res[i].dataValues.org_radius
      }
      centerFound = true
    }
  }
  return center
}

const getBBox = res => {
  let bbox = false
  let i = 0

  if (res[i] && res[i].dataValues) {
    const values = res[i] && res[i].dataValues

    while (res[i] && !bbox) { // NOTE: the first row where a center is found will be used

      // check if there is a site center
      if (values.site_ll_lat) {
        bbox = {
          W: values.site_ll_lon,
          N: values.site_ur_lat,
          E: values.site_ur_lon,
          S: values.site_ll_lat,
          center_lon: res[i].dataValues.site_center_lon,
          center_lat: res[i].dataValues.site_center_lat,
          domain_orgTitle: res[1].dataValues.domain_orgTitle
        }
      }

      // if not a site center, check if there is an org center
      if (!bbox && values.org_ll_lat) {
        bbox = {
          W: values.org_ll_lon,
          N: values.org_ur_lat,
          E: values.org_ur_lon,
          S: values.org_ll_lat,
          center_lon: res[i].dataValues.org_center_lon,
          center_lat: res[i].dataValues.org_center_lat,
          domain_orgTitle: res[1].dataValues.domain_orgTitle
        }
      }
    }
  }
  return bbox
}

const cleanHostname = (hostname) => {
  let cleaned = hostname.split(/.opendata|.hub/)[0] // get domain name from before '.opendata.|.hub.arcgis.com'
  if (cleaned == hostname || cleaned === undefined) {
    const split = cleaned.split('.')
    if (split.length > 1) {
      return split
    }

    // if there are no common punctuation, return the first 5 characters
    return `${hostname.substring(0,6)}%`
  }

  let cleanedParts = cleaned.split(/[\_\-.]/)
  let first_parts = cleanedParts.slice(0, 2)
  const wildcard_hostname = `%${first_parts[0]}%${first_parts[1]}%`
  return wildcard_hostname
}

const getLocality = async (hostname, options) => {
  let locality = null
  let domain_orgTitle = null

  // clean dimension_hostname
  let cleaned_hostname = cleanHostname(hostname)

  // HACK: attempt to get locality using specific substrings
  if (Array.isArray(cleaned_hostname)) {
    if (cleaned_hostname.length > 2) {
      cleaned_hostname = `%${cleaned_hostname[1]}.${cleaned_hostname[2]}%`
    } else {
      cleaned_hostname = `%${cleaned_hostname[1]}%`
    }
  }

  // check if there are associated domains or siteUrls
  const res = await options.CompositeModel.findAll({
    where: {
      [Op.or]: {
        domain_hostname: {
          [Op.like]: cleaned_hostname
        },
        site_siteUrl: {
          [Op.like]: cleaned_hostname
        }
      }
    }
  })

  // // if there's associated domains, get a center (retrieving the first success)
  // if (res) { options.locality = _getCenter(res) }

  // if there's associated domains, get N S E W (retrieving the first success)
  if (res && res.length >= 1) { locality = getBBox(res) }

  return locality
}

module.exports = { getLocality, getCenter, getBBox }