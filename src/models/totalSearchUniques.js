const Sequelize = require('sequelize')
const { GA_key } = require('../config')

const model = {

  sql: {
    table_name: 'total_search_uniques',

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
      }
    },

    // create sequel model
    createModel: async (sequelize, columns) => {
      try {
        const Model = await sequelize.define('total_search_uniques', columns,
        {
          timestamps: false,
          initialAutoIncrement: 1
        })

        if (Model && Model != null) { console.log(`Successfully created a model`)}
        return Model

      } catch (error) {
        console.log(`error in createModel: ${error}`)
      }
    }
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