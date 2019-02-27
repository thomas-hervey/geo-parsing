const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_parsed_text'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      parsed_text: {
        type: Sequelize.STRING,
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model