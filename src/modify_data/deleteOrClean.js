
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



const checkIsNonEnglish= input => {

	const ascii = /[^\x00-\x7F.–°—­•′″”’·º¨‘/]/;
	return ascii.test(input);

	// Archived ascii regex (not good enough)
	// const ascii = [^\x00-\x7F]+
	// const ascii = /[\x80-\xFF]/;
	// const ascii = /^[ -~\t\n\r]+$/;
	// const ascii = /[^\x00-\x7F]/;
	// const ascii = /[^\x00-\x7F.–°—­•′″”’·º¨‘/​]/;
}

let idsToDelete = []

const containsCoords = input => {
  const ascii = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/
  return ascii.test(input)
}

const deleteOrClean = async (record) => {
	let currKeyword = record.dimension_searchKeyword

	if (checkIsNonEnglish(currKeyword) || containsCoords(currKeyword)) {
    // delete
    return record.id

  }

  // else {
	// 	// try to clean value
	// 	let newKeyword = cleanValue(currKeyword)

	// 	if (currKeyword !== newKeyword) {
	// 		// update if cleaned value is different
	// 		record.dimension_searchKeyword = newKeyword;

	// 		await record.then(() => {})
	// 	}
	// }

}


module.exports = deleteOrClean