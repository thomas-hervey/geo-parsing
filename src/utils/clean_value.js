const S = require('string')
const { isEmpty } = require('../utils/string_parsing')

const cleanValue = (field) => {
  try {
    const valueToClean = field
    if (!isEmpty(valueToClean) && valueToClean.length > 3) { // field is long enough and not empty
      let cleanedValue = ''
      cleanedValue = valueToClean // clone to avoid unintentional mutations
      return S(cleanedValue)
          .strip("*", "\"", "\'") // strip values
          .trim() // trim whitespace
          .latinise() // remove accents from Latin characters
          .s
    } else {
      console.log(`field with value ${field} is not defined, doesn't have a value, or is shorter than 4 characters.`)
      return field
    }
  } catch (error) {
    console.log('cleanValue error: ', error)
  }
}

module.exports = cleanValue
