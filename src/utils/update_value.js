const updateValue = async (Model, original_element, updates, options) => {

  if (updates) { // TODO: check if this is a valuable check

    // create where clause
    let whereClause = { where: {} }
    whereClause.where[options.columnName] = original_element

    // update record
    await Model.findOne(whereClause)
    .then(res => {
      // Check if record exists in db
      if (res) {
        // TODO: update other elements of record using `updates`

        res[options.columnName] = updates.cleaned // update record

        res.save().then(() => {}) // save record
      }
    })
    .catch(err => console.log(`updateValue Error ${err}`))
  }
}

module.exports = updateValue