const _createPlacenamesLink = async (Model, res, updates, options) => {
  try {
    const { PlacenameModel } = options
    const { placenames } = updates

    // for each placename, find or create, and update with res id
    const insert = placenames[0].map(placenameId => {
      if (!isNaN(placenameId) && placenameId != undefined && placenameId != '') {
        const tableName = Model.getTableName()
        return {
          'geonames_id': placenameId,
          'openData_id': res.index_value,
          'openData_tableName': tableName
        }
      }
    }).filter(function (el) { return el != null })


    PlacenameModel.bulkCreate(
      insert,
      {
        fields:["geonames_id", "openData_id", "openData_tableName"],
      }
    )

  } catch (error) {
    console.log('_createPlacenamesLink error: ', error)
  }
}

const updateValue = async (Model, original_record_value, updates, options) => {
  try {
    const { columnName } = options.database

    if (updates) {

      // create where clause
      let whereClause = { where: {} }
      whereClause.where[columnName] = original_record_value

      // update record
      await Model.findOne(whereClause)
      .then(res => {
        // Check if record exists in db
        if (res) {
          // TODO: update other elements of record using `updates`

          res[columnName] = updates.cleaned // update record string
          res['containsCoords'] = updates.containsCoords // record if contains coords
          res['containsAddress'] = updates.containsAddress // record if contains address
          res['updated'] += 1 // record that record was updated // TODO: add back

          res.save().then(() => {}) // save record

          if(updates.placenames) {
            _createPlacenamesLink(Model, res, updates, options) // create placenames link
          }
        }
      })
      .catch(err => console.log(`updateValue error: ${err}`))
    }
  } catch (error) {
    console.log('updateValue error: ', error)
  }
}

module.exports = updateValue