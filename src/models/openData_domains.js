const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_domains'

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
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model
