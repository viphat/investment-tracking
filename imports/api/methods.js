import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { fetchMetadata, fetchInvestmentRecords, updateDatabaseLastUpdateTimestamp } from './notion.js'

Meteor.methods({
  'notion.fetchAll'() {
    fetchMetadata()
    fetchInvestmentRecords()
    updateDatabaseLastUpdateTimestamp()
  }
})
