const _extractDocSubset = (records, corpus) => {
  const num_docs_using = corpus.num_docs_using
  const starting_index = corpus.docs_starting_index

  console.log(`iterateDocs: Using a document subset of ${corpus.num_docs_using} : ${records.length}`)

  return records.slice(starting_index, num_docs_using + starting_index)
}

const iterateDocs = async (Model, callback, options = { where: {} }) => {
  try {
    const where = options.table.where

    console.log(`iterateDocs: about to query docs...`)


    // find records
    let records = await Model.findAll({ where })

    console.log(`iterateDocs: Found ${records.length} results`)

    // take a subset if desired
    if(options.corpus.subset) { records = _extractDocSubset(records, options.corpus) }

    let doc_iterator = 0
    let skipOrUpdate = ''

    // iterate records
    for (const record of records) {

      // if the record hasn't been viewed...
      if (record.dataValues.viewed <= 1) {
        // run callback on record
        const update = await callback(record, options)
        skipOrUpdate = 'UPDATE'
      } else {
        skipOrUpdate = 'SKIP'
      }

      doc_iterator += 1


      if (doc_iterator % 1000 === 0) {
        console.log(`iterator counter: ${doc_iterator}. ${skipOrUpdate} document with index_value: ${record.dataValues.index_value}`)
      }
    }
    console.log('done iterating records!')
  } catch (error) {
    console.log(`iterateDocs Error: ${error}`);
  }
}

module.exports = iterateDocs