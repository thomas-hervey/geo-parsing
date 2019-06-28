// create sequel model
const createModel = async (sequelize, columns, model_name) => {
  try {
    const Model = await sequelize.define(model_name, columns,
    {
      timestamps: false,
    })

    if (Model && Model != null) { console.log(`Successfully created a model for ${model_name}`)}
    return Model

  } catch (error) {
    console.log(`error in createModel: ${error}`)
  }
}

module.exports = createModel