const iterateDocs = async (Model, callback, options = { where: {} }) => {
  try {
    const where = options.database.where

    console.log(`iterateDocs: about to query all docs`)
    // find records
    const res = await Model.findAll({ where })

    console.log(`iterateDocs: Found ${res.length} results`)

    // iterate records
    res.forEach(async element => {
      if (!element.dataValues.updated >= 1) { // if the element hasn't been updated...
        const update = await callback(Model, element, options)
        console.log('Updated element: ', element.dataValues.index_value)
      }
    })
  } catch (error) {
    console.log(`iterateDocs Error: ${error}`);
  }
}

module.exports = iterateDocs