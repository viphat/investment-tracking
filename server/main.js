import { Meteor } from 'meteor/meteor';
import dotenv from 'dotenv'
// import { InvestingRecords, Categories, Tags } from '/imports/api/databaseSchema';
import { fetchCategories } from '/imports/api/notion'

Meteor.startup(() => {
  dotenv.config({
    path: `${process.env.PWD}/.env`
  });

  console.log(process.env.NOTION_API_VERSION)

  fetchCategories()
});
