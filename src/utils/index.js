const calculateCentroid = require('./calculate_centroid')
const cleanValue = require('./clean_value')
const convertCoords = require('./convert_coords')
const containsAddress = require('./contains_address')
const containsCoords = require('./contains_coords')
const containsPlacenames = require('./contains_placenames')
const getLocality = require('./get_locality')
const getSiteOrgExtent = require('./get_site_org_extent')
const iterateDocs = require('./iterate_docs')
const updateValue = require('./update_value')

module.exports = {
  calculateCentroid,
  cleanValue,
  convertCoords,
  containsAddress,
  containsCoords,
  containsPlacenames,
  getLocality,
  getSiteOrgExtent,
  iterateDocs,
  updateValue
}