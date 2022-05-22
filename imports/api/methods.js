import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { fetchMetadata, updateDatabaseLastUpdateTimestamp } from './notion.js'

Meteor.methods({
  'notion.fetchAll'() {
    fetchMetadata()
    updateDatabaseLastUpdateTimestamp()
  }
})
