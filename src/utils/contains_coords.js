const containsCoords = input => {
  const ascii = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/
  return ascii.test(input)
}

module.exports = containsCoords