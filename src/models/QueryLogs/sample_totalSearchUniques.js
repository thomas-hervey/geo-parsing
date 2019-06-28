const Sequelize = require('sequelize')
const createModel = require('./create_model')

const { GA_key } = require('../config')

const model_name = 'sample_total_search_uniques'

const model = {

  sql: {
    table_name: model_name,

    columns: {
      index_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      dimension_searchKeyword: {
        type: Sequelize.STRING(10000),
        allowNull: false
      },
      metric_searchUniques: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      viewed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // containsCoords: {
      //   type: Sequelize.TINYINT,
      //   allowNull: false,
      // },
      // containsAddress: {
      //   type: Sequelize.TINYINT,
      //   allowNull: false,
      // }
    },

    // create sequel model
    createModel: createModel
  },

  GA_QueryParams: {
    ids: 'ga:105201909',
    start_date: '2016-08-01', // search seems to have launched on August 01, 2016
    end_date: '2018-08-01',
    metrics: ['ga:searchUniques'],
    dimensions: ['ga:searchKeyword'],
    sort: 'ga:searchKeyword',
    start_index: 1,
    max_results: 10000,
    key: GA_key
  },

  reformulation: function (row, placeholder)  {
    return {
      dimension_searchKeyword: row[0] || placeholder,
      metric_searchUniques: row[1]
    }
  }
}


module.exports = model