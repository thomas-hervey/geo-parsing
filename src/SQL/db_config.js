const db_credentials = {
  databse: 'OpenData',
  user: 'root',
  password: 'MQZ(mp1100'
}

const sql_credentials = {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  }
}

module.exports = {
  db_credentials,
  sql_credentials
}