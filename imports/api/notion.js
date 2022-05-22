import https from 'https';
import dotenv from 'dotenv'
import { Categories, Tags, KeyValueStore, InvestmentRecords } from './databaseSchema'
import { PAGE_SIZE, DATABASE_LAST_UPDATE_TIMESTAMP_KEY } from './const'

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

const hasMorePage = (body) => {
  return body['has_more'] === true && body['next_cursor'] !== null
}

const loadDataFromNotion = (investmentRecordIds, options, nextCursor = undefined) => {
  var data = {
    "page_size": PAGE_SIZE
    // "page_size": 5,
    // "filter": {
    //   "property": "Category",
    //   "select": {
    //     "equals": "Lendings"
    //   }
    // }
  }

  if (nextCursor) {
    data = {
      ...data,
      ...{ "start_cursor": nextCursor }
    }
  }

  return new Promise((resolve, reject) => {
    var req = https.request(options, res => {
      var resBody = '';

      res.on('data', (chunk) => {
        resBody = resBody + chunk;
      });

      res.on('end', async () => {
        const body = JSON.parse(resBody)

        body['results'].forEach((investmentRecord) => {
          insertOrUpdateInvestmentRecord(investmentRecord)
          investmentRecordIds.push(investmentRecord['id'])
        })

        if (hasMorePage(body)) {
          resolve(loadDataFromNotion(investmentRecordIds, options, body['next_cursor']))
        } else {
          resolve(investmentRecordIds)
        }
      })
    })

    req.write(JSON.stringify(data))

    req.on('error', error => {
      console.error(error);
      reject(error);
    });

    req.end()
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

export const fetchInvestmentRecords = () => {
  let investmentRecordIds = []
  let options = {
    ...baseOptions,
    ...{
      method: 'POST',
      path: `/v1/databases/${process.env.NOTION_DATABASE}/query`,
    }
  }

  loadDataFromNotion(investmentRecordIds, options).then((res) => {
    InvestmentRecords.remove({ _id: { $nin: res }})
  })
}

const insertOrUpdateInvestmentRecord = (investmentRecord) => {
  const properties = investmentRecord['properties'];

  if (!(properties['Category']['select'] && properties['Category']['select']['id'])) {
    return; // Empty Row
  }

  let record = {
    _id: investmentRecord['id'],
    categoryId: properties['Category']['select']['id'], // Required
    itemName: properties['Item Name']['title'][0]['plain_text'], // Required
    amount: properties['Amount']['number'], // Required
    year: properties['Year']['number'], // Required
    date: properties['Date']['date']['start'], // Required
    profitLoss: properties['Profit/Loss']['number'],
  }

  if (properties['Comment']['rich_text'][0] && properties['Comment']['rich_text'][0]['plain_text']) {
    record = {
      ...record,
      ...{
        comment: properties['Comment']['rich_text'][0]['plain_text']
      }
    }
  }

  if (properties['Tags']['multi_select'].length > 0) {
    const tagIds = []

    properties['Tags']['multi_select'].forEach(tag => {
      tagIds.push(tag['id'])
    })

    record = {
      ...record,
      ...{ tagIds: tagIds }
    }
  }

  InvestmentRecords.schema.validate(record)

  if (InvestmentRecords.findOne({ _id: record['_id'] })) {
    InvestmentRecords.update({ _id: record['_id'] }, record)
  } else {
    InvestmentRecords.insert(record)
  }
}
