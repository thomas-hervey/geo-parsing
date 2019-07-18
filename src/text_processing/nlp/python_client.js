const axios = require('axios')

const pythonClient = async (route, query, options) => {
  try {
    // example: http://127.0.0.1:5000/parse/?sentence=I like apples.
    const url = `http://127.0.0.1:5000/${route}/?query_string=${query}`

    const result = await axios.get(url);

    if(result && result.data.length && result.status === 200) {
      return result.data[0]
    }

    return

  } catch (error) {
    console.error(`pythonClient error: ${error}`);
  }
}

module.exports = pythonClient
