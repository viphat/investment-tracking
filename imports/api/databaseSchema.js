import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const InvestingRecords = new Mongo.Collection('investingRecords');

const categorySchema = new SimpleSchema({
  _id: { type: String },
  name: { type: String },
  color: { type: String }
})

const tagSchema = new SimpleSchema({
  _id: { type: String },
  name: { type: String },
  color: { type: String }
})

InvestingRecords.schema = new SimpleSchema({
  _id: { type: String },
  category: { type: categorySchema },
  tags: { type: Array, optional: true },
  "tags.$": { type: tagSchema },
  itemName: { type: String },
  amount: { type: Number },
  date: { type: String },
  profitLoss: { type: Number, optional: true },
  comment: { type: String, optional: true },
  year: { type: Number }
})

export const Categories = new Mongo.Collection('categories');
Categories.schema = categorySchema

export const Tags = new Mongo.Collection('tags');
Tags.schema = tagSchema

export const KeyValueStore = new Mongo.Collection('keyValueStores');
