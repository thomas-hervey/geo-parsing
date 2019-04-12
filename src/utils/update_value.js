const { isEmpty } = require('lodash')

const updateValue = async (record, options) => {
  console.log('TODO: fix domain parsing for locality. Look at placenames records, seems like phoenix and charleston are using the same center. Also, the center seems way off anyways')
  console.log('TODO: the error seems to be when taking just the first bit of a multi decimal domain')

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
      const { ParsedSearchKeywordModel, ParsedSearchRefinementModel } = options

      // save parsed keyword
      if (parsed_searchKeyword.dimension_searchKeyword) {
        await ParsedSearchKeywordModel.create({
          first_found_id: record.dataValues.index_value,
          parsed_text: parsed_searchKeyword.dimension_searchKeyword,
          containsCoords: parsed_searchKeyword.containsCoords,
          containsAddress: parsed_searchKeyword.containsAddress,
          counter: 1
        })
        .then(res => { /* console.log('save parsed text res: ', res) */ })
        .catch(err => { console.log('save parsed text err: ', err)})
      }

      // save parsed keyword refinement
      if (parsed_searchRefinement.dimension_searchRefinement) {
        await ParsedSearchRefinementModel.create({
          first_found_id: record.dataValues.index_value,
          parsed_text: parsed_searchRefinement.dimension_searchRefinement,
          containsCoords_refinement: parsed_searchRefinement.containsCoords_refinement,
          containsAddress_refinement: parsed_searchRefinement.containsAddress_refinement,
          counter: 1
        })
        .then(res => { /* console.log('save parsed text res: ', res) */ })
        .catch(err => { console.log('save parsed text err: ', err)})
      }
    } catch (error) { console.log('updateValue create/update has_been_parsed error: ', error) }


    // *************************************** //
    // record placenames that have been parsed //
    // *************************************** //
    try {

      const { placenames } = updates.placenames

      // if placenames found, save to db
      if(placenames && placenames.length > 0) {
        placenames.map(async (placename, index) => {

          if (!isNaN(placename.geonames_id) && placename != undefined && placename != '') {
            await options.PlacenameModel.create({
              geonames_id: placename.geonames_id,
              string: placename.string.join('|') || '',
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'original', // NOTE: hard coded
              openData_tableName: 'search_refinements', // NOTE: hard coded
              domain_orgTitle: options.locality? options.locality.domain_orgTitle : 'unsure',
              domain: options.domain || 'unsure',
              center: options.locality ? options.locality.center_lat.toString() + ',' + options.locality.center_lon.toString() : 'unsure'
            })
            .then(res => { /* console.log('update placenames res: ', res) */ })
            .catch(err => { console.log('update placenames err: ', err)})

            // console.log('saving placenames result: ', placenameEntry)
          }
        })
      }
    } catch (error) { console.log('add placenames to index error:  ', error) }

    try {

      const { placenames_refinement } = updates.placenames

      // if refinement placenames found, save to db
      if(placenames_refinement && placenames_refinement.length > 0) {
        placenames_refinement.map(async (placename, index) => {

          if (!isNaN(placename.geonames_id) && placename != undefined && placename != '') {
            await options.PlacenameModel.create({
              geonames_id: placename.geonames_id,
              string: placename.string.join('|'),
              openData_id: record.dataValues.index_value,
              parse_order: index + 1,
              original_or_refinement: 'refinement', // NOTE: hard coded
              openData_tableName: 'search_refinements', // NOTE: hard coded
              domain: options.domain,
              domain_orgTitle: options.locality? options.locality.domain_orgTitle : 'unsure',
              center: options.locality ? options.locality.center_lat.toString() + ',' + options.locality.center_lon.toString() : 'unsure'
            })
            .then(res => { /* console.log('update placenames refinement res: ', res) */ })
            .catch(err => { console.log('update placenames refinement record err: ', err)})

            // console.log('saving placenames refinement result: ', placenameRefinementEntry)
          }
        })
      }
    } catch (error) { console.log('add placename refinements to index error: ', error) }

  }
}

module.exports = updateValue