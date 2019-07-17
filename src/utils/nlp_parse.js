const pythonClient = require('../text_processing/nlp/python_client')

const nlpParse = async (text, options) => {
  try {

    const route = 'spacy'

    // create a document from text
    const results = await pythonClient(route, text, options)

    if(results) { return JSON.stringify(results) }

  } catch (error) { console.log(`_nlp_parse error: ${error}`) }
}

module.exports = nlpParse