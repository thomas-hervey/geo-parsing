const iterateDocs = async (Model, callback, options = { where: {} }) => {
  try {
    const where = options.where
    // find records
    const res = await Model.findAll({ where })

    // iterate records
    res.forEach(async element => {
      await callback(Model, element, options)
    })
  } catch (error) {
    console.log(`iterateDocs Error: ${error}`);
  }
}

module.exports = iterateDocs