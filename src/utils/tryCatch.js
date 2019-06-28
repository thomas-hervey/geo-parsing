const tryCatchAsync = async (operation) => {
  try {
    const res = await operation()
    return res
  } catch (error) { console.log(`error in tryCatchAsync`) }
}

module.exports = { tryCatchAsync }