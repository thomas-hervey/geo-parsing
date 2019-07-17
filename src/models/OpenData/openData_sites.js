const Sequelize = require('sequelize')
const createModel = require('../create_model')

const model_name = 'openData_sites'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      site_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      site_name: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      site_ll_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_ll_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_ur_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_ur_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_center_lon: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_center_lat: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_radius: {
        type: Sequelize.FLOAT,
        primaryKey: false,
        allowNull: true
      },
      site_orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      site_orgName: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      site_size: {
        type: Sequelize.INTEGER(11),
        primaryKey: false,
        allowNull: true
      },
      site_siteUrl: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      site_region: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      site_sector: {
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