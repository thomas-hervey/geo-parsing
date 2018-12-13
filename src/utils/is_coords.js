const isCoords = input => {
  const ascii = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/
return ascii.test(input);
}

module.exports = isCoords