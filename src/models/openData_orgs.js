const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_orgs'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      ll_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      ll_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      ur_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      ur_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      center_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      center_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      radius: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model