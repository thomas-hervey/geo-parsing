const { center, featureCollection, point } = require('turf')

const calculateCentroid = (input) => {
  try {
    const points = [
      point ( [
        input.ll_lon,
        input.ll_lat
      ] ),
      point ( [
        input.ur_lon,
        input.ur_lat
      ] )
    ]

    var features = featureCollection(points)
    return center(features)
  } catch (error) { console.warn(`calculate_centroid error: $(error)`) }
}

module.exports = calculateCentroid