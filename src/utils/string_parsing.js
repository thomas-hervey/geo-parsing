const S = require('string')

function isEmpty(field) {
	try {
		return S(field).isEmpty()
	} catch (error) {
		console.log(error)
	}
}

function isCoordinate(input) {
	const formatcoords = require('formatcoords')
	try {
		return !isEmpty(input) && !formatcoords(input) === false ? true : false
	} catch (error) {
		console.log('ERROR: ', error)
		return false
	}
}

module.exports = { isEmpty, isCoordinate }
