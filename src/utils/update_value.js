const updateValue = async (existingValue, updatedValue, options) => {
  if (existingValue !== updatedValue) {

    // create where clause
    let wereClause = {}
    wereClause[options.inputString] = existingValue

    // update record
    await Model.findOne({ where: wereClause })
    .then(res => {
      // Check if record exists in db
      if (res) {
        res[options.inputString] = updatedValue // update record
        res.save().then(() => {}) // save record
      }
    })
    .catch(err => console.log(`updateValue Error ${err}`))
  }
}

module.exports = updateValue