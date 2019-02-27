const { isEmpty } = require('lodash')

const updateValue = async (record, updates, options) => {

  if (updates && !isEmpty(updates)) {

    try {
      const {
        cleaned_searchKeyword,
        cleaned_searchRefinement,
        containsCoords,
        containsAddress,
        containsCoords_refinement,
        containsAddress_refinement
      } = updates

      // update record
      const updateRes = await record.update({
        dimension_searchKeyword: cleaned_searchKeyword,
        dimension_searchRefinement: cleaned_searchRefinement,
        containsCoords,
        containsAddress,
        containsCoords_refinement,
        containsAddress_refinement,
        updated: 1
      })
      .then(res => { /* console.log('update record res: ', res) */ })
      .catch(err => { console.log('update record err: ', err)})

      // save parsed text to index
      const parsedTextRes = await options.HasBeenParsedModel.create({
        parsed_text: cleaned_searchKeyword
      })
      .then(res => { /* console.log('save parsed text res: ', res) */ })
      .catch(err => { console.log('save parsed text err: ', err)})

      const parsedTextRefinementRes = await options.HasBeenParsedModel.create({
        parsed_text: cleaned_searchRefinement
      })
      .then(res => { /* console.log('save parsed text res: ', res) */ })
      .catch(err => { console.log('save parsed text err: ', err)})

    } catch (error) { console.log('updateValue or parsed text error: ', error) }

    try {
      // if placenames found, save to db
      if(updates.placenames) {
        updates.placenames.map(async (placename, index) => {

          if (!isNaN(placename) && placename != undefined && placename != '') {
            const placenameEntry = await options.PlacenameModel.create({
              geonames_id: placename,
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'original', // NOTE: hard coded
              openData_tableName: 'search_refinements'// NOTE: hard coded
            })
            .then(res => { console.log('update placenames res: ', res)})
            .catch(err => { console.log('update placenames err: ', err)})

            // console.log('saving placenames result: ', placenameEntry)
          }
        })
      }
    } catch (error) { console.log('add placenames to index error:  ', error) }

    try {
      // if refinement placenames found, save to db
      if(updates.placenames_refinement) {
        updates.placenames_refinement.map(async (placename, index) => {

          if (!isNaN(placename) && placename != undefined && placename != '') {
            const placenameRefinementEntry = await options.PlacenameModel.create({
              geonames_id: placename,
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'refinement', // NOTE: hard coded
              openData_tableName: 'search_refinements'// NOTE: hard coded
            })
            .then(res => { console.log('update placenames refinement res: ', res)})
            .catch(err => { console.log('update placenames refinement record err: ', err)})

            // console.log('saving placenames refinement result: ', placenameRefinementEntry)
          }
        })
      }
    } catch (error) { console.log('add placename refinements to index error: ', error) }

  }
}

module.exports = updateValue