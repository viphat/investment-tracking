import { Meteor } from 'meteor/meteor';
import dotenv from 'dotenv'
import { Categories, Tags, InvestmentRecords } from '/imports/api/databaseSchema';
import { fetchMetadata, updateDatabaseLastUpdateTimestamp, fetchInvestmentRecords } from '/imports/api/notion'
import '/imports/api/methods'

Meteor.startup(() => {
  dotenv.config({
    path: `${process.env.PWD}/.env`
  });

  if (Categories.find().count() === 0 || Tags.find().count() === 0) {
    fetchMetadata()
    fetchInvestmentRecords()
    updateDatabaseLastUpdateTimestamp()
  }
});
