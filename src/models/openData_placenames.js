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
      openData_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      original_or_refinement: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      openData_tableName: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model