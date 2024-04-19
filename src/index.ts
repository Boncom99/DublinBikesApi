import express from 'express';
//fetch
import fetch from 'node-fetch';
import { getSchema, Schema } from './computeSchema';
import { applyFilter, properType } from './filter';
import { transformDataToUseProperNames } from './transformDataToUseProperNames';
const app = express();
const port = 3000;
const url = `http://localhost:${port}/`;

let schema: Schema[] = [];

fetch('https://app-media.noloco.app/noloco/dublin-bikes.json')
  .then((res) => res.json())
  .then((json) => {
    if (!Array.isArray(json)) {
      throw new Error('json is not an array');
    }
    schema = getSchema(json);
  });
app.use(express.json());

app.get('/schema', (req, res) => {
  res.send(schema);
});
app.post('/data', (req, res) => {
  fetch('https://app-media.noloco.app/noloco/dublin-bikes.json')
    .then((res) => (res ? res.json() : null))
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('data is not an array');
      }
      //transform each field to use the schema name
      const formattedData = transformDataToUseProperNames(data, schema);

      const filters = req?.body?.where;
      if (!filters) {
        //if no filter return all rows
        res.send(formattedData);
        return;
      }
      const filteredData = applyFilter(formattedData, filters, schema);
      res.send(filteredData);
    });
});
app.listen(port, () => {
  console.log(`Example app listening ${url}`);
});
