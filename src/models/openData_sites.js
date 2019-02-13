const Sequelize = require('sequelize')

const model = {

  sql: {
    table_name: 'openData_sites',

    columns: {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      searchDescription: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      extent: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      orgName: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      size: {
        type: Sequelize.INT(11),
        primaryKey: false,
        allowNull: false
      },
      siteUrl: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      region: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
      sector: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: false
      },
    },

    // create sequel model
    createModel: async (sequelize, columns) => {
      try {
        const Model = await sequelize.define('openData_sites', columns,
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