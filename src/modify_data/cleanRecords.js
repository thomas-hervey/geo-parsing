const _ = require('lodash');
const {
  cleanValue
} = require('../utils')

let bulkRecords = []

const updateSingleValue = async (record, options) => {
  try {

    const { cleanedKeyword } = options
      const { TotalSearchCleanModel } = options

      // save parsed keyword
      if (cleanedKeyword) {
        const record_clone = _.cloneDeep(record);
        record_clone.dataValues.dimension_searchKeyword = cleanedKeyword
        record_clone.dataValues.viewed = 1

        // check if record exists, if it does, update not create
        await TotalSearchCleanModel.findOne({
          where: {
            dimension_searchKeyword: record_clone.dataValues.dimension_searchKeyword
          }
        })
          .then(async (res) => {
            if (res !== null) {
              await TotalSearchCleanModel.update({
                metric_searchUniques: record_clone.metric_searchUniques + res.dataValues.metric_searchUniques
              }, {
                where: {
                  dimension_searchKeyword: record_clone.dimension_searchKeyword
                }
              })
              .then(res => { /* console.log('save parsed text res: ', res) */ })
              .catch(err => { console.log('save parsed text err: ', err)})
            } else {
              await TotalSearchCleanModel.create(record_clone.dataValues)
                .then(res => { /* console.log('save parsed text res: ', res) */ })
                .catch(err => { console.log('save parsed text err: ', err)})
            }
          })

      }
  } catch (error) {

  }
}

const cleanRecords = async (record, options) => {

  const { dataValues } = record;

  // get searchKeyword value
  const searchKeyword_value = record[options.table.columnName]

  /*
  clean record
  */
  const cleaned = cleanValue(searchKeyword_value)
  dataValues.dimension_searchKeyword = cleaned

  // add to array
  bulkRecords.push(dataValues)


  // save every 1000
  if (bulkRecords.length % 1000 === 0) {

    const { modelToSaveTo } = options

    await modelToSaveTo.bulkCreate(bulkRecords)
      .then(() => {
        console.log(`successfully saved records at index: ${bulkRecords[0].id} - ${bulkRecords[bulkRecords.length-1].id}`)
      })
      .catch((err) => console.log(`error saving records at index: ${bulkRecords[0].index_value} - ${bulkRecords[bulkRecords.length-1].index_value} with error: ${err}`))

    bulkRecords = []
  }
}

module.exports = { cleanRecords, updateSingleValue }