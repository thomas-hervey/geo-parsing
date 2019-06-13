const spacy = require('spacy')

const nlp = spacy.default.load('en_core_web_sm')

const _nlp_parse = async (text, options) => {
  try {

    // create a document from text
    const doc = await nlp(text)

    const summary_details = {
      num_tokens: doc.length,

    }

  } catch (error) { console.log(`_nlp_parse error: ${error}`) }
}


const parseRecord = async (record, options) => {

  /*
   run nlp parsing
  */

  // get searchKeyword value
  const searchKeyword_value = record[options.database.columnName]

  const results = _nlp_parse(searchKeyword_value, options)


}

module.exports = parseRecord