const _extractDocSubset = (res, options) => {
  const num_docs_using = options.num_docs_using
  const starting_index = options.docs_starting_index

  console.log(`iterateDocs: Using ${options.num_docs_using}`)

  return res.slice(starting_index, num_docs_using + starting_index)
}

const iterateDocs = async (Model, callback, options = { where: {} }) => {
  try {
    const where = options.database.where

    console.log(`iterateDocs: about to query docs`)
    // find records
    let res = await Model.findAll({ where })

    console.log(`iterateDocs: Found ${res.length} results`)

    // res = _extractDocSubset(res, options)

    let doc_iterator = 0
    let skipUpdate = ''

    // iterate records
    for (const element of res) {
      if (element.dataValues.updated <= 1) { // if the element hasn't been updated...
        const update = await callback(Model, element, options)
        skipUpdate = 'update'
      } else { skipUpdate = 'skip' }
      doc_iterator += 1
      console.log(`iterator counter: ${doc_iterator}. ${skipUpdate} document with index_value: ${element.dataValues.index_value}`)
    }
    console.log('done iterating elements!')
  } catch (error) {
    console.log(`iterateDocs Error: ${error}`);
  }
}

module.exports = iterateDocs