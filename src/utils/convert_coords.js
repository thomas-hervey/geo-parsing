const { SpatialReference, Point, CoordinateTransformation } = require('gdal')

const convertCoords = ({ lon, lat }, start_sr = 'epsg:3857', end_sr = 'epsg:4236') => {

  const srs0 = SpatialReference.fromProj4(`+init=${start_sr}`);
  const srs1 = SpatialReference.fromProj4(`+init=${end_sr}`);

  let pt = new Point(lon, lat);
  const ct = new CoordinateTransformation(srs0, srs1);

  pt.transform(ct);

  return {
    lon: pt.x,
    lat: pt.y,
  }
}


module.exports = convertCoords