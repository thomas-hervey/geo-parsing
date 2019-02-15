const Sequelize = require('sequelize')
const { GA_key } = require('../config')

const model = {

  sql: {
    table_name: 'search_refinements',

    columns: {
      index_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      dimension_searchKeyword: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dimension_searchRefinement: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dimension_hostname: {
        type: Sequelize.STRING,
      },
      dimension_dateHourMinute: {
        type: Sequelize.DATE,
      },
      metric_searchUniques: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      metric_searchResultViews: { type: Sequelize.INTEGER },
      metric_searchSessions: { type: Sequelize.INTEGER },
      metric_searchDepth: { type: Sequelize.INTEGER },
      metric_searchRefinements: { type: Sequelize.INTEGER },
      metric_searchDuration: { type: Sequelize.INTEGER },
      metric_searchExits: { type: Sequelize.INTEGER },
      containsCoords: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
      },
      containsAddress: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
      },
      containsCoords_refinement: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
      },
      containsAddress_refinement: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
      }
    },

    // create sequel model
    createModel: async (sequelize, columns) => {
      try {
        const Model = await sequelize.define('search_refinements', columns,
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
    start_date: '2018-04-08', // search seems to have launched on August 01, 2016
    end_date: '2018-08-05',
    metrics: ['ga:searchResultViews', 'ga:searchUniques', 'ga:searchSessions', 'ga:searchDepth', 'ga:searchRefinements', 'ga:searchDuration', 'ga:searchExits'],
    dimensions: ['ga:searchKeyword', 'ga:searchKeywordRefinement', 'ga:hostname', 'ga:dateHourMinute'],
    sort: 'ga:searchKeyword',
    start_index: 1,
    max_results: 10000,
    key: GA_key
  },

  reformulation: function (row, placeholder)  {
    return {
      dimension_searchKeyword: row[0] || placeholder,
      dimension_searchRefinement: row[1] || placeholder,
      dimension_hostname: row[2] || placeholder,
      dimension_dateHourMinute: row[3] || placeholder,
      metric_searchUniques: row[4],
      metric_searchResultViews: row[5],
      metric_searchSessions: row[6],
      metric_searchDepth: row[7],
      metric_searchRefinements: row[8],
      metric_searchDuration: row[9],
      metric_searchExits: row[10]
    }
  }
}

module.exports = model