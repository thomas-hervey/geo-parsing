const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_has_been_parsed'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      parsed_text: {
        type: Sequelize.STRING,
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model