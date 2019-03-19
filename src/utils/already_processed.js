const alreadyParsed = async (value, model) => {
  let alreadyParsed = false
  const parsedModel = model

  // check if searchKeyword has been parsed already
   await parsedModel.find({
    where: {
      parsed_text: value
    }
  })
  .then(async res => {
    // if it has...
    if (res && res.dataValues && res.dataValues.first_found_id) {

      // get id to later query any placenames already saved
      alreadyParsed = res.dataValues.first_found_id

      // and update the counter
      let currCounter = res.dataValues.counter
      await res.update({
        counter: currCounter + 1
      })
      .then(res => {})
      .catch(error => console.log('update parsed text counter error: ', error))
    }
  })
  .catch(error => console.log('find parsed text error: ', error))

  return alreadyParsed
}

const checkForPlacenames = async (id, options) => {
  let placenamesFound = false

  //if placenames exist, return them to be updated
  await options.PlacenameModel.findAll({
    where: {
      openData_id: id
    }
  })
  .then(res => {
    if (res && res.length >=1 && res[0].dataValues) {

      placenamesFound = res
    }
  })
  .catch(error => console.log('find placename error: ', error))

  return placenamesFound
}

const copyPlacenames = async (id, placenames, options) => {
  console.log(placenames)

  const updated_placenames = placenames
  updated_placenames.map(placename => {
    placename.openData_id = id
    return placename
  })

  await options.PlacenameModel.bulkCreate(updated_placenames)
  .then(res => { console.log('copied placenames!') })
  .catch(error => console.log('copy placenames error: ', error))
}

module.exports = { alreadyParsed, checkForPlacenames, copyPlacenames }