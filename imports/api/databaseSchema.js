import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const InvestingRecords = new Mongo.Collection('investingRecords');

InvestingRecords.schema = new SimpleSchema({
  __id: { type: String },
  category: { type: Object },
  tags: { type: [Object], optional: true },
  itemName: { type: String },
  amount: { type: Number },
  date: { type: String },
  profitLoss: { type: Number, optional: true },
  comment: { type: String, optional: true }
  year: { type: Number }
})

export const Categories = new Mongo.Collection('categories');

Categories.schema = new SimpleSchema({
  __id: { type: String },
  name: { type: String },
  color: { type: String }
})

export const Tags = new Mongo.Collection('tags');

Tags.schema = new SimpleSchema({
  __id: { type: String },
  name: { type: String },
  color: { type: String }
})

export const KeyValueStore = new Mongo.Collection('keyValueStores');

