const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_parsed_searchKeyword'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      first_found_id: {
        type: Sequelize.INTEGER,
      },
      parsed_text: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      containsCoords: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
      },
      containsAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      counter: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model