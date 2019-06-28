const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_composite'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      domain_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      domain_hostname: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      domain_siteId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      domain_siteTitle: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      domain_orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      domain_orgTitle: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
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
