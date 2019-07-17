const refinementsModel = require('./searchRefinements')
const compositeModel = require('./openData_composite')
const placenameModel = require('./openData_placenames')
// const hasBeenParsedModel = require('./openData_parsed_searchKeyword')
const parsedSearchKeywordModel = require('./openData_parsed_searchKeyword')
const parsedSearchRefinementModel = require('./openData_parsed_searchRefinement')
const sampleTotalSearchUniques = require('./sample_totalSearchUniques')
const totalSearchUniques = require('./totalSearchUniques')

const totalSearchUniquesCombined = require('./totalSearchUniquesCombined')
const totalSearchUniquesCombinedClean = require('./totalSearchUniquesCombinedClean')


const createModelsForPipeline = async (sequelize, options) => {
  // sample_total_search_uniques
  const SampleTotalSearchModel = await sampleTotalSearchUniques.sql.createModel(sequelize, sampleTotalSearchUniques.sql.columns, sampleTotalSearchUniques.sql.table_name)
  options.SampleTotalSearchModel = SampleTotalSearchModel
  SampleTotalSearchModel.sync()

  // total_search_uniques
  const TotalSearchUniquesModel = await totalSearchUniques.sql.createModel(sequelize, totalSearchUniques.sql.columns, totalSearchUniques.sql.table_name)
  options.TotalSearchUniquesModel = TotalSearchUniquesModel
  TotalSearchUniquesModel.sync()

  const TotalSearchUniquesCombinedModel = await totalSearchUniquesCombined.sql.createModel(sequelize, totalSearchUniquesCombined.sql.columns, 'total_search_uniques_combined')
  options.TotalSearchUniquesCombinedModel = TotalSearchUniquesCombinedModel
  TotalSearchUniquesCombinedModel.sync()

  const TotalSearchUniquesCombinedCleanModel = await totalSearchUniquesCombinedClean.sql.createModel(sequelize, totalSearchUniquesCombinedClean.sql.columns, 'total_search_uniques_combined_clean')
  options.TotalSearchUniquesCombinedCleanModel = TotalSearchUniquesCombinedCleanModel
  TotalSearchUniquesCombinedCleanModel.sync()

  // `search_refinements`
  const RefinementModel = await refinementsModel.sql.createModel(sequelize, refinementsModel.sql.columns, refinementsModel.sql.table_name)
  options.RefinementModel = RefinementModel
  RefinementModel.sync()

  // `OpenData_composite`
  const CompositeModel = await compositeModel.sql.createModel(sequelize, compositeModel.sql.columns, compositeModel.sql.table_name)
  options.CompositeModel = CompositeModel
  CompositeModel.sync()

  // `openData_placenames`
  const PlacenameModel = await placenameModel.sql.createModel(sequelize, placenameModel.sql.columns, placenameModel.sql.table_name)
  options.PlacenameModel = PlacenameModel
  PlacenameModel.sync()

  // // `openData_parsed_text`
  // const HasBeenParsedModel = await hasBeenParsedModel.sql.createModel(sequelize, hasBeenParsedModel.sql.columns, hasBeenParsedModel.sql.table_name)
  // options.HasBeenParsedModel = HasBeenParsedModel
  // HasBeenParsedModel.sync()

  const ParsedSearchKeywordModel = await parsedSearchKeywordModel.sql.createModel(sequelize, parsedSearchKeywordModel.sql.columns, parsedSearchKeywordModel.sql.table_name)
  options.ParsedSearchKeywordModel = ParsedSearchKeywordModel
  ParsedSearchKeywordModel.sync()

  const ParsedSearchRefinementModel = await parsedSearchRefinementModel.sql.createModel(sequelize, parsedSearchRefinementModel.sql.columns, parsedSearchRefinementModel.sql.table_name)
  options.ParsedSearchRefinementModel = ParsedSearchRefinementModel
  ParsedSearchRefinementModel.sync()

  // assign model to iterate
  options.modelToIterate = options[options.modelToIterate]

  return options
}

module.exports = createModelsForPipeline