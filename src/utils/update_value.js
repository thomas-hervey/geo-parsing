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

const updateValue = async (record, updates, options) => {
  try {

    if (updates) {

      const {
        cleaned_searchKeyword,
        cleaned_searchRefinement,
        containsCoords,
        containsAddress,
        containsCoords_refinement,
        containsAddress_refinement
      } = updates

      // update record
      await record.update({
        dimension_searchKeyword: cleaned_searchKeyword,
        dimension_searchRefinement: cleaned_searchRefinement,
        containsCoords,
        containsAddress,
        containsCoords_refinement,
        containsAddress_refinement,
        updated: record.updated += 1
      })
      .then(res => {
        console.log('updating record result: ', res)

        // if placenames found, save to db
        if(updates.placenames) {
          updates.placenames.map(async (placename, index) => {
            const placenameEntry = await options.PlacenamesModel.build({
              geonames_id: placename,
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'original', // NOTE: hard coded
              openData_tableName: 'search_refinements'// NOTE: hard coded
            })
          })
        }

        // if refinement placenames found, save to db
        if(updates.placenames_refinement) {
          updates.placenames_refinement.map(async (placename, index) => {
            const placenameRefinementEntry = await options.PlacenamesModel.build({
              geonames_id: placename,
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'refinement', // NOTE: hard coded
              openData_tableName: 'search_refinements'// NOTE: hard coded
            })
          })
        }

      })
      .catch(err => console.log(`updateValue error: ${err}`))

    }
  } catch (error) {
    console.log('updateValue error: ', error)
  }
}

module.exports = updateValue