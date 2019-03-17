const { isEmpty } = require('lodash')

const updateValue = async (record, options) => {

  const { updates } = options

  if (updates && !isEmpty(updates)) {

    // *********************************** //
    // update counter on searchRefinements //
    // *********************************** //
    // TODO: uncomment when done
    // try {

    //   // update record
    //   const updateRes = await record.update({ viewed: 1 })
    //   .then(res => { /* console.log('update record res: ', res) */ })
    //   .catch(err => { console.log('update record err: ', err)})

    // } catch (error) { console.log('updateValue update searchRefinements error: ', error) }

    // ******************************** //
    // record text that has been parsed //
    // ******************************** //
    try {

      const { parsed_searchKeyword, parsed_searchRefinement, } = updates

      // save parsed keyword
      if (parsed_searchKeyword.dimension_searchKeyword) {
        const parsedTextRes = await options.parsedSearchKeywordModel.create({
          first_found_id: record.id,
          parsed_text: parsed_searchKeyword.dimension_searchKeyword,
          containsCoords: parsed_searchKeyword.containsCoords,
          containsAddress_refinement: parsed_searchKeyword.containsAddress,
          counter: 1
        })
        .then(res => { /* console.log('save parsed text res: ', res) */ })
        .catch(err => { console.log('save parsed text err: ', err)})
      }

      // save parsed keyword refinement
      if (parsed_searchRefinement.dimension_searchRefinement) {
        const parsedTextRefinementRes = await options.parsedKeywordRefinementModel.create({
          first_found_id: record.id,
          parsed_text: parsed_searchRefinement.dimension_searchRefinement,
          containsCoords: parsed_searchRefinement.containsCoords_refinement,
          containsAddress_refinement: parsed_searchRefinement.containsAddress_refinement,
          counter: 1
        })
        .then(res => { /* console.log('save parsed text res: ', res) */ })
        .catch(err => { console.log('save parsed text err: ', err)})
      }
    } catch (error) { console.log('updateValue create/update has_been_parsed error: ', error) }


    // // *************************************** //
    // // record placenames that have been parsed //
    // // *************************************** //
    // try {

    //   const { placenames } = updates

    //   // if placenames found, save to db
    //   if(placenames.placenames) {
    //     placenames.placenames.map(async (placename, index) => {

    //       if (!isNaN(placename) && placename != undefined && placename != '') {
    //         const placenameEntry = await options.PlacenameModel.create({
    //           geonames_id: placename,
    //           openData_id: record.dataValues.index_value,
    //           parse_order: index + 1,
    //           original_or_refinement: 'original', // NOTE: hard coded
    //           openData_tableName: 'search_refinements'// NOTE: hard coded
    //         })
    //         .then(res => { console.log('update placenames res: ', res)})
    //         .catch(err => { console.log('update placenames err: ', err)})

    //         // console.log('saving placenames result: ', placenameEntry)
    //       }
    //     })
    //   }
    // } catch (error) { console.log('add placenames to index error:  ', error) }

    // try {
    //   // if refinement placenames found, save to db
    //   if(placenames.placenames_refinement) {
    //     placenames.placenames_refinement.map(async (placename, index) => {

    //       if (!isNaN(placename) && placename != undefined && placename != '') {
    //         const placenameRefinementEntry = await options.PlacenameModel.create({
    //           geonames_id: placename,
    //           openData_id: record.dataValues.index_value,
    //           parse_order: index + 1,
    //           original_or_refinement: 'refinement', // NOTE: hard coded
    //           openData_tableName: 'search_refinements'// NOTE: hard coded
    //         })
    //         .then(res => { console.log('update placenames refinement res: ', res)})
    //         .catch(err => { console.log('update placenames refinement record err: ', err)})

    //         // console.log('saving placenames refinement result: ', placenameRefinementEntry)
    //       }
    //     })
    //   }
    // } catch (error) { console.log('add placename refinements to index error: ', error) }

  }
}

module.exports = updateValue