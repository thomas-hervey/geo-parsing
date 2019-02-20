const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_domains'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      hostname: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      siteId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      siteTitle: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      orgTitle: {
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
