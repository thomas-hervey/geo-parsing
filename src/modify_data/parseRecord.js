const {
  containsAddress,
  containsCoords,
  containsPlacenames,
  nlpParse
} = require('../utils');


const parseRecord = async (record, options) => {

  const parsed = {}

  try {
    // get searchKeyword value
    parsed.dimension_searchKeyword = record[options.table.columnName]

    // check if record has already been parsed
    if(!record.viewed) {


      /*
      run nlp parsing
      */
      parsed.nlp = await nlpParse(parsed.dimension_searchKeyword, options)


      /*
      check for coordinates
      */
      parsed.containsCoords = containsCoords(parsed.dimension_searchKeyword)


      /*
      check for an address
      */
      parsed.containsAddress = await containsAddress(parsed.dimension_searchKeyword)


      /*
      check for placenames
      */
      parsed.placenames = await containsPlacenames(record, parsed.dimension_searchKeyword, options)


      // TODO: save parsed somewhere
      // TODO: update record as viewed
      // TODO: switch to word parsing

      // mark record as being viewed
      record.viewed = 1

      console.log(parsed);
    }

  } catch (error) {
    console.log('parseRecord error: ', error)
  }
}

module.exports = parseRecord