const containsCoords = input => {
  const ascii = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/
  const res = ascii.test(input)
  return res ? 1: 0;
}

module.exports = containsCoords