const calculateCentroid = require('./calculate_centroid')
const cleanValue = require('./clean_value')
const convertCoords = require('./convert_coords')
const containsAddress = require('./contains_address')
const containsCoords = require('./contains_coords')
const containsPlacenames = require('./contains_placenames')
const getLocality = require('./get_locality')
const getSiteOrg = require('./get_site_org')
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
  getSiteOrg,
  iterateDocs,
  updateValue
}