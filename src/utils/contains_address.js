const { parser } = require('node-postal')

const containsAddress = async input => {
  const address_reges = /(\d{0,}\s{0,})(\w+){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd|road|lane|ln|dr|pkwy|cir|circle|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd|NE|NE |SE|SE |SW|SW |NW|NW |E|E |S|S |W|W )/i
  if (address_reges.test(input)) {
    const parts = await getAddressParts(input)
    return JSON.stringify(parts)
  }
  return 'no_address'
}

const getAddressParts = async input => {
  const parts = await parser.parse_address(input)
  return parts
}

module.exports = { containsAddress, getAddressParts }