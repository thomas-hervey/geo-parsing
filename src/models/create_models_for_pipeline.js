const refinementsModel = require('./searchRefinements')
const compositeModel = require('./openData_composite')
const placenameModel = require('./openData_placenames')
// const hasBeenParsedModel = require('./openData_parsed_searchKeyword')
const parsedSearchKeywordModel = require('./openData_parsed_searchKeyword')
const parsedSearchRefinementModel = require('./openData_parsed_searchRefinement')


const createModelsForPipeline = async (sequelize, options) => {
  // `search_refinements`
  const RefinementModel = await refinementsModel.sql.createModel(sequelize, refinementsModel.sql.columns, refinementsModel.sql.table_name)
  options.RefinementModel = RefinementModel
  options.modelToIterate = RefinementModel
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

  return options
}

module.exports = createModelsForPipeline