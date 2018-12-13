const iterateDocs = async (Model, callback) => {
  const res = await Model.findAll()
  res.forEach(async element => {
    await callback(element)
  })
}

module.exports = iterateDocs