const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_placenames'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      geonames_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      string: {
        type: Sequelize.STRING,
      },
      openData_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      parse_order: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      original_or_refinement: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      openData_tableName: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      domain: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      center: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      }
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model