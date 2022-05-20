import https from 'https';
import dotenv from 'dotenv'
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

export const fetchCategories = () => {
  console.log(baseOptions)

  var req = https.request(baseOptions, res => {
    console.log(`statusCode: ${res.statusCode}`);
    var resBody = '';

    res.on('data', (chunk) => {
      resBody = resBody + chunk;
    });

    res.on('end', () => {
      console.log(JSON.parse(resBody))
    })
  })

  req.on('error', error => {
    console.error(error);
  });

  req.end();
}
