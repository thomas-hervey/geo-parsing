const spacyClient = require('../text_processing/nlp/spacy_client')

const {
  alreadyParsed,
  cleanValue,
  tryCatchAsync
} = require('../utils')

const _nlp_parse = async (text, options) => {
  try {

    // create a document from text
    const results = await spacyClient(text)

    if(results) { return JSON.stringify(results) }

  } catch (error) { console.log(`_nlp_parse error: ${error}`) }
}


const parseRecord = async (record, options) => {

  const parsed = {}

  try {
    // get searchKeyword value
    const searchKeyword_value = record[options.table.columnName]

    /*
    clean record
    */
    parsed.cleanedKeyword = cleanValue(searchKeyword_value)

    // check if keyword has already been parsed
    let alreadyParsedID = await alreadyParsed(parsed.cleanedKeyword, options.ParsedSearchKeywordModel)

    if(!alreadyParsedID) {

      /*
      run nlp parsing
      */
      parsed.nlp = tryCatchAsync(_nlp_parse(parsed.cleanedKeyword, options))


      /*
      check for coordinates
      */
      parsed.containsCoords = containsCoords(parsed.dimension_searchKeyword)

      /*
      check for an address
      */
      parsed.containsAddress = await containsAddress(parsed.dimension_searchKeyword)

      // /*
      // check for placenames
      // */
      // placenames.placenames = await containsPlacenames(record, parsed.dimension_searchKeyword, options)
    }

  } catch (error) {
    console.log('parseRecord error: ', error)
  }
}

module.exports = parseRecord