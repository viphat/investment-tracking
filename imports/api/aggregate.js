import { Categories, Tags, KeyValueStore, InvestmentRecords } from './databaseSchema'
import { SUM_TOTAL } from './const'

export const calculateAndUpdateTotalSum = async () => {
  const pipeline = [{ $group: { _id: null, total: { $sum: "$amount" } }}];
  var result = InvestmentRecords.aggregate(pipeline);

  KeyValueStore.update({ key: SUM_TOTAL }, { key: SUM_TOTAL, value: result[0]['total'] }, { upsert: true})
}

export const calculateAndUpdateCategorySum = async (category) => {
  console.log(category)

  const pipeline = [{ $match: { categoryId: category['_id'] } }, { $group: { _id: null, total: { $sum: "$amount" } }}];

  var result = InvestmentRecords.aggregate(pipeline);

  KeyValueStore.update({ key: `sum-${category['_id']}` }, { key: `sum-${category['_id']}`, value: result[0]['total'] }, { upsert: true})
}
