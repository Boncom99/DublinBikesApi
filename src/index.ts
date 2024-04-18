import express from 'express';
//fetch
import fetch from 'node-fetch';
import { getSchema } from './computeSchema';
const app = express();
const port = 3000;
let schema = {};

fetch('https://app-media.noloco.app/noloco/dublin-bikes.json')
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    if (!Array.isArray(json)) {
      throw new Error('json is not an array');
    }
    schema = getSchema(json);
    console.log(schema);
  });

app.get('/schema', (req, res) => {
  res.send(schema);
});
app.post('/data', (req, res) => {
  fetch('https://app-media.noloco.app/noloco/dublin-bikes.json')
    .then((res) => res.json())
    .then((json) => {
      //filter the json
      //return the filtered json
      res.send(json);
    });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
