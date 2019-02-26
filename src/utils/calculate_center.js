const calculateCentroid = require('./calculate_centroid')


const _diff = (a,b) => { return Math.abs(a-b) }

const calculateCenter = async (Model, record, options) => {
  try {
    const res = calculateCentroid(record)
    if (res !== null) {
      const center = res.geometry.coordinates
      const center_lon = center[0]
      const center_lat = center[1]
      const lon_diff = _diff(center_lon, record.dataValues.ll_lon)
      const lat_diff = _diff(center_lat, record.dataValues.ll_lat)
      // also calculate the radius as the larger of the x or y dimensions from the centroid
      const radius = lon_diff > lat_diff ? lon_diff : lat_diff

      await record.update({
        center_lon,
        center_lat,
        radius
      })
      .then(() => {
        console.log('successfully updated: ', record.dataValues.id)
      })
      .catch(err => console.log('record save error: ', err))

      console.log('in')
    }
  } catch (error) {
    console.log('_calculateCenter error: ', error)
  }
}

module.exports = calculateCenter