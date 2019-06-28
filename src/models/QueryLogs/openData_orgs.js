const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_orgs'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      org_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      org_name: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      org_ll_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_ll_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_ur_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_ur_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_center_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_center_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      org_radius: {
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