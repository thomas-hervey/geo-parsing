const Sequelize = require('sequelize')

const model = {

  sql: {
    table_name: 'openData_domains',

    columns: {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: true
      },
      hostname: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      siteId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      siteTitle: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      orgId: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
      orgTitle: {
        type: Sequelize.STRING,
        primaryKey: false,
        allowNull: true
      },
    },

    // create sequel model
    createModel: async (sequelize, columns) => {
      try {
        const Model = await sequelize.define('openData_domains', columns,
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


// searchDescription: {
//   type: Sequelize.TEXT,
//   primaryKey: false,
//   allowNull: false
// },
// ll_lat: {
//   type: Sequelize.FLOAT,
//   primaryKey: false,
//   allowNull: true
// },
// ll_lon: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },
// ur_lat: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },
// ur_lon: {
//   type: Sequelize.DECIMAL,
//   primaryKey: false,
//   allowNull: true
// },