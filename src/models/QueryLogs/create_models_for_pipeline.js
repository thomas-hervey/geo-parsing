const keywords = require('../../../../GA/src/models/new/keywords')


const createModelsForPipeline = async (sequelize, options) => {

  // keywords_combined_slim
  const KeywordsCombinedSlimModel = await keywords.sql.createModel(sequelize, keywords.sql.columns, 'keywords_combined_slim')
  options.KeywordsCombinedSlimModel = KeywordsCombinedSlimModel
  KeywordsCombinedSlimModel.sync()


  // keywords_sample
  const KeywordsSample = await keywords.sql.createModel(sequelize, keywords.sql.columns, 'keywords_sample')
  options.KeywordsSample = KeywordsSample
  KeywordsSample.sync()


  // keywords_humanized_reduced
  const KeywordsHumanizedReduced = await keywords.sql.createModel(sequelize, keywords.sql.columns, 'keywords_humanized_reduced')
  options.KeywordsHumanizedReduced = KeywordsHumanizedReduced
  KeywordsHumanizedReduced.sync()



  // assign model to iterate
  options.modelToIterate = options[options.modelToIterate]

  // assign model to save to
  options.modelToSaveTo = options[options.modelToSaveTo]

  return options
}

module.exports = createModelsForPipeline