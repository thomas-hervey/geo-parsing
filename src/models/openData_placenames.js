const Sequelize = require('sequelize')

const model = {

  sql: {
    table_name: 'openData_placenames',

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
    createModel: async (sequelize, columns) => {
      try {
        const Model = await sequelize.define('openData_placenames', columns,
        {
          timestamps: false,
        })

        if (Model && Model != null) { console.log(`Successfully created a model`)}
        return Model

      } catch (error) {
        console.log(`error in createModel: ${error}`)
      }
    }
  }
}


module.exports = model