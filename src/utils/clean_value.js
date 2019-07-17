const _ = require('lodash')
const S = require('string')
const { isEmpty } = require('../utils/string_parsing')

const cleanValue = (field) => {
  try {
    const valueToClean = field
    if (!isEmpty(valueToClean) && valueToClean.length > 3) { // field is long enough and not empty
      let cleanedValue = ''

      cleanedValue = _.cloneDeep(valueToClean) // clone to avoid unintentional mutations
      cleanedValue = S(cleanedValue)
          .trim()
          .replaceAll("_", " ") // replace underscores
          .strip("*", "\"", "\'",) // strip values
          .trim() // trim whitespace

      cleanedValue = cleanedValue
        .latinise() // remove accents from Latin characters
        .humanize() // normalize dashes and underscores for human reading
        .s

      return cleanedValue
    } else {
      // console.log(`field with value ${field} is not defined, doesn't have a value, or is shorter than 4 characters.`)
      return field
    }
  } catch (error) {
    console.log('cleanValue error: ', error)
  }
}

module.exports = cleanValue
