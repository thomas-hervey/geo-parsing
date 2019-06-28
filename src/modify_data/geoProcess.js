const {
  alreadyParsed,
  checkForPlacenames,
  copyPlacenames,
  cleanValue,
  containsCoords,
  containsAddress,
  containsPlacenames,
  updateValue,
  calculateCentroid
} = require('../utils')

const geoProcess = async (record, options) => { // NOTE: **the record is a model, therefore we don't need to use 'MODEL'

  try {

    const parsed_searchKeyword = {}
    const parsed_searchRefinement = {}
    const placenames = {}

    // ******************** //
    // parse search keyword //
    // ******************** //

    // get searchKeyword value
    const searchKeyword_value = record[options.table.columnName]

    // clean value
    const cleanedKeyword = cleanValue(searchKeyword_value)

    // check if keyword has already been parsed
    let alreadyParsedID = await alreadyParsed(cleanedKeyword, options.ParsedSearchKeywordModel)

    // if keyword has already been parsed, skip
    if(!alreadyParsedID) {

      parsed_searchKeyword.dimension_searchKeyword = cleanedKeyword

      // check if element contains coords
      parsed_searchKeyword.containsCoords = containsCoords(parsed_searchKeyword.dimension_searchKeyword)

      // check if element contains address
      parsed_searchKeyword.containsAddress = await containsAddress(parsed_searchKeyword.dimension_searchKeyword)

      // if coords & addresses aren't present check if elements contains place names
      if (!parsed_searchKeyword.containsCoords) {
        placenames.placenames = await containsPlacenames(record, parsed_searchKeyword.dimension_searchKeyword, options)
      }
    }

    else {
      // if the text has been parsed, check if placenames were saved
      const existingPlacenames = await checkForPlacenames(alreadyParsedID, options)
      // check if placenames exist
      if (existingPlacenames) {
        // if domains are the same
        if (record.dataValues.dimension_hostname === existingPlacenames[0].dataValues.dimension_hostname) {
          // duplicate with new id
          await copyPlacenames(record.dataValues.id, existingPlacenames, options)
        } else {
          // otherwise, rerun parser
          placenames.placenames = await containsPlacenames(record, parsed_searchKeyword.dimension_searchKeyword, options)
        }
      }
    }

    // *************************** //
    // repeat steps for refinement //
    // *************************** //

    // get searchRefinement value
    const searchRefinement_value = record[options.table.refinementColumnName]

    // clean value
    const cleanedRefinement = cleanValue(searchRefinement_value)

   // check if keyword refinement has already been parsed
   const alreadyParsedID_refinement = await alreadyParsed(cleanedRefinement, options.ParsedSearchRefinementModel)

    // if refinement has already been parsed, skip
    if(!alreadyParsedID_refinement) {

      parsed_searchRefinement.dimension_searchRefinement = cleanedRefinement

      // check if element contains coords
      parsed_searchRefinement.containsCoords_refinement = containsCoords(parsed_searchRefinement.dimension_searchRefinement)

      // check if element contains address
      parsed_searchRefinement.containsAddress_refinement = await containsAddress(parsed_searchRefinement.dimension_searchRefinement)

      parsed_searchRefinement.counter = 1

      // if coords & addresses aren't present check if elements contains place names
      if (!parsed_searchRefinement.containsCoords_refinement) {
        placenames.placenames_refinement = await containsPlacenames(record, parsed_searchRefinement.dimension_searchRefinement, options)
      }
    }
    else {
      // if the text has been parsed, check if placenames were saved
      const existingPlacenames_refinements = await checkForPlacenames(alreadyParsedID, options)
      // check if placenames exist
      if (existingPlacenames_refinements) {
        // if domains are the same
        if (record.dataValues.dimension_hostname === existingPlacenames_refinements[0].dataValues.dimension_hostname) {
          // duplicate with new id
          await copyPlacenames(record.dataValues.id, existingPlacenames_refinements, options)
        } else {
          // otherwise, rerun parser
          placenames.placenames_refinement = await containsPlacenames(record, parsed_searchRefinement.dimension_searchRefinement, options)
        }
      }
    }

    // if both keyword and refinement haven't been parsed, update
    if (!alreadyParsedID || !alreadyParsedID_refinement) {
      let updates = {
        parsed_searchKeyword,
        parsed_searchRefinement,
        placenames
      }

      options.updates = updates
      options.domain = record.dataValues.dimension_hostname

      // save record with updates
      await updateValue(record, options) // TODO: update values (the middle corresponding table)
    }

  } catch (err) { console.log(`geoProcess Error: ${err}`) }

}

module.exports = geoProcess