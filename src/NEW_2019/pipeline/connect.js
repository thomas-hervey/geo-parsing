const { Pool, Client } = require('pg')
const pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true // capitalize all generated SQL
});

const connect = async (credentials) => {
  try {
    const db = pgp(credentials)

    const pool = new Pool(credentials)
    const client = new Client(credentials).connect()


    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    return { db, pool, client }

  } catch (error) { console.log(`'connect()' error: ${error}`) }
}

module.exports = { connect }