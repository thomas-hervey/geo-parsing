const cleanValue = require('./clean_value')
const containsAddress = require('./contains_address')
const containsCoords = require('./contains_coords')
const containsPlacenames = require('./contains_placenames')
const getLocality = require('./get_locality')
const iterateDocs = require('./iterate_docs')
const updateValue = require('./update_value')

module.exports = {
  cleanValue,
  containsAddress,
  containsCoords,
  containsPlacenames,
  getLocality,
  iterateDocs,
  updateValue
}