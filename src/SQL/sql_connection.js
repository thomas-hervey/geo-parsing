const Sequelize = require('sequelize')

const sql_connection = async (sql_config) => {
  const { db_credentials, sql_credentials } = sql_config

  // create connection
  const sequelize = new Sequelize(
    db_credentials.databse,
    db_credentials.user,
    db_credentials.password,
    sql_credentials,
  )

  // test connection
  await sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

  return sequelize
}

module.exports = sql_connection