const Sequelize = require('sequelize')
const createModel = require('./create_model')

const model_name = 'openData_parsed_text'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      geonames_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      },
      dimension_searchKeyword: {
        type: Sequelize.STRING,
      },
      dimension_searchRefinement: {
        type: Sequelize.STRING,
      },
    },

    // create sequel model
    createModel: createModel
  }
}


module.exports = model