import https from 'https';
import dotenv from 'dotenv'
import { Categories, Tags, KeyValueStore } from './databaseSchema'
import { DATABASE_LAST_UPDATE_TIMESTAMP_KEY } from './const'

dotenv.config({
  path: `${process.env.PWD}/.env`
});

const baseOptions = {
  hostname: 'api.notion.com',
  port: 443,
  path: `/v1/databases/${process.env.NOTION_DATABASE}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Notion-Version': process.env.NOTION_API_VERSION,
    'Authorization': `Bearer ${process.env.NOTION_SECRET_TOKEN}`,
  }
}

const insertOrUpdateCategories = (body) => {
  const categoriesData = body['properties']['Category']['select']['options']

  categoriesData.forEach(categoryData => {
    const categoryObj = {
      _id: categoryData['id'],
      name: categoryData['name'],
      color: categoryData['color']
    }

    Categories.schema.validate(categoryObj)
    Categories.update({ _id: categoryObj['_id'] }, categoryObj, { upsert: true })
  })
}

const insertOrUpdateTags = (body) => {
  const tagsData = body['properties']['Tags']['multi_select']['options']

  tagsData.forEach(tagData => {
    const tagObj = {
      _id: tagData['id'],
      name: tagData['name'],
      color: tagData['color']
    }

    Tags.schema.validate(tagObj)
    Tags.update({ _id: tagObj['_id'] }, tagObj, { upsert: true })
  })
}

export const updateDatabaseLastUpdateTimestamp = () => {
  KeyValueStore.update({ key: DATABASE_LAST_UPDATE_TIMESTAMP_KEY }, { key: DATABASE_LAST_UPDATE_TIMESTAMP_KEY, value: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() }, { upsert: true } )
}

export const fetchMetadata = () => {
  var req = https.request(baseOptions, res => {
    console.log(`statusCode: ${res.statusCode}`);
    var resBody = '';

    res.on('data', (chunk) => {
      resBody = resBody + chunk;
    });

    res.on('end', async () => {
      const body = JSON.parse(resBody)
      insertOrUpdateCategories(body)
      insertOrUpdateTags(body)
    })
  })

  req.on('error', error => {
    console.error(error);
  });

  req.end();
}
