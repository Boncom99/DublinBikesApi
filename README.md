# Dublin bikes SERVER

## Quick Start

Clone the repo:
```bash
git clone git@github.com:Boncom99/DublinBikesApi.git
cd DublinBikesApi
```
install dependencies:
```bash
npm install
```
run server:
```bash
npm start
```
<img width="683" alt="Screenshot 2024-04-21 at 10 50 03" src="https://github.com/Boncom99/DublinBikesApi/assets/45794572/2e22e99d-4b09-4df0-bc2b-a994c499affe">

## Endpoints
To call the API I recommend using [Postman](https://www.postman.com/). You can copy [this](https://www.postman.com/spaceflight-meteorologist-26122477/workspace/noloco-test/request/24899203-999a7a17-f1cc-4bff-bdb7-b5f16bf7c8fb
) workspace I made.
<br/>

### `GET: /schema`
to fetch the schema structure you can navigate to http://localhost:3000/schema and get this result:

<img width="1440" alt="Screenshot 2024-04-21 at 10 40 54" src="https://github.com/Boncom99/DublinBikesApi/assets/45794572/913e8a20-88e7-4cc9-9a4d-f778843f57a5">


### `POST: /data`
to fetch filtered data using Postman, you can send a body with a `where` object. example:
```javascript
{
    "where":{
         "id":{"gt":44433567},
        "availableBikes":{"gt":23},
        "bonus":{"eq":false}
    }
}
```
<img width="1004" alt="Screenshot 2024-04-21 at 10 41 32" src="https://github.com/Boncom99/DublinBikesApi/assets/45794572/673d0614-f644-47fb-9bb1-1d0d62e4ec2e">


## features:
- ✅ get schema
- ✅ get filtered data (using one or more filters)


## Author's notes:
Hi! 
This is my answer to the test: https://noloco.slite.page/p/4HQ2VnsZ_/Full-Stack-Engineering-Exercise

I chose to use [nodeJs](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript) with [ExpressJs](https://expressjs.com/) and Typescript since it's what I feel more comfortable with and it's similar to Noloco's stack. 

While developing the `getSchemasTypes()` function, I had to choose between extracting the schema from the first element or using all of them to derive it. The first option would have been simpler, but my personal experience told me that external datasets are imperfect. Sometimes in a number field, you can find `1, "1", "one", "approx 1", "low"`. So I decided to get the data type of all the objects and then assign the more frequent one. 

Regarding the filtering, I implemented the multiple filters feature, since the complexity of implementing it was low and the value it gives is quite big.

If I had more time, I would improve (in order of priority):
-  <ins>Sort by, and pagination</ins>.
In terms of complexity, it's quite easy, and the value it gives is huge. For the pagination, I would have done something like this:
```javascript
function paginate(array, pageNumber, numberPerPage) {
    const startIndex = (pageNumber - 1) * numberPerPage;
    return array.slice(startIndex, startIndex + numberPerPage);
}
```
-  <ins>`POST/create` & `POST/edit/:id` endpoints</ins>.
It would be a game changer if we allow users to also add and edit records to the dataset. The implementation would have required setting up a database or writing into a JSON file the new records, which is a bit more time-consuming. But it could give them the ability to make it more personalized, keep it updated and add private bike stations they had.
-  <ins>better error handling</ins>. Easy but not much value.
