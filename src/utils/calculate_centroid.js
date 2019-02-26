const { center, featureCollection, point } = require('turf')

const calculateCentroid = ({ dataValues }) => {
  try {
    if (dataValues.ll_lon !== null) {
      const points = [
        point ( [
          dataValues.ll_lon,
          dataValues.ll_lat
        ] ),
        point ( [
          dataValues.ur_lon,
          dataValues.ur_lat
        ] )
      ]

      var features = featureCollection(points)
      return center(features)
    }
    return null
  } catch (error) { console.warn(`calculate_centroid error: $(error)`) }
}

module.exports = calculateCentroid