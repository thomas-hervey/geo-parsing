const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_sites'

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
      orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      orgName: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      size: {
        type: Sequelize.INTEGER(11),
        primaryKey: false,
        allowNull: true
      },
      siteUrl: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      region: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      sector: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model


// searchDescription: {
//   type: Sequelize.TEXT,
//   primaryKey: false,
//   allowNull: false
// },
// ll_lat: {
//   type: Sequelize.FLOAT,
//   primaryKey: false,
//   allowNull: true
// },
// ll_lon: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },
// ur_lat: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },
// ur_lon: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },