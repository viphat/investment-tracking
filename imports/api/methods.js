import { Meteor } from 'meteor/meteor';
import { Categories } from './databaseSchema'
import { fetchMetadata, fetchInvestmentRecords, updateDatabaseLastUpdateTimestamp } from './notion'
import { calculateAndUpdateTotalSum, calculateAndUpdateCategorySum, clearDatabase } from './aggregate'

Meteor.methods({
  'notion.fetchAll'() {
    fetchMetadata()
    fetchInvestmentRecords()
    updateDatabaseLastUpdateTimestamp()
  }
})

Meteor.methods({
  'data.aggregate'() {
    calculateAndUpdateTotalSum()

    Categories.find({}).fetch().forEach((category) => {
      calculateAndUpdateCategorySum(category)
    })
  }
})

Meteor.methods({
  'data.clear'() {
    clearDatabase()
  }
})
