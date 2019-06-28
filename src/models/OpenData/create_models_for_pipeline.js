const keywords = require('../../../../GA/src/models/new/keywords')


const createModelsForPipeline = async (sequelize, options) => {

  // keywords_combined_slim
  const KeywordsCombinedSlimModel = await keywords.sql.createModel(sequelize, keywords.sql.columns, 'keywords_combined_slim')
  options.KeywordsCombinedSlimModel = KeywordsCombinedSlimModel
  KeywordsCombinedSlimModel.sync()



  // assign model to iterate
  options.modelToIterate = options[options.modelToIterate]

  return options
}

module.exports = createModelsForPipeline