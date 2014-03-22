# bigquery
----

This is a simple sdk for using google bigquery. Still working... if any problem, please let me know.

## Installation

```
npm install bigquery
```

## Apply service account

Follow the doc: http://gappsnews.blogspot.tw/2013/10/connect-cloud-platform-bigquery-using.html

## Convert p12 key
From admin console, create a service account, save the client_secrets.json and it's key
ex: Translate p12 to pem
```
openssl pkcs12 -in privatekey.p12 -out privatekey.pem -nocerts
openssl rsa -in privatekey.pem -out key.pem
```

## Initial

Load bigquery lib, specify your project id then setup the service account and the client_secret.json file path, pem key file path for auth use.

```
var bq = require('bigquery')
  , fs = require('fs')
  , prjId = 'your-bigquery-project-id'; //you need to modify this

bq.init({
  client_secret: '/path-to-client_secret.json',
  privatekey_pem: '/path-to-privatekey.pem',
  key_pem: '/path-to-key.pem'
});
```

## Do Query

Query the dataset that you have. The sample bellow is to query the public dataset of wikipedia.

```
bq.job.query(prjId, 'select count(*) from publicdata:samples.wikipedia', function(e,r,d){
  if(e) console.log(e);
  console.log(JSON.stringify(d));
});
```

## Load data

Before load data, you must create your dataset and table first. After that, you can use the following code to load data. (In this case test is the dataset id, testtb1 is the table name.)

```
var data = [
 {
   "insertId": "201403221228", //option
   "json": {
     "name": "simon",
     "sex": "M",
     "age": 35
   }
 }
];

bq.job.load(prjId, 'test', 'testtb1', data, function(e,r,d){
  if(e) console.log(e);
  console.log(JSON.stringify(d));
})
```
PS: The insertId use for prevent the duplicate insert of data.

## Create Dataset & Table

Create dataset and table, the schema please ref: https://developers.google.com/bigquery/preparing-data-for-bigquery

```
bq.dataset.create(prjId, 'dataset_name', function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});

var schema = {
  "fields": [
   {
    "name": "field1",
    "type": "string",
    "description": "test"
   },
   {
    "name": "field2",
    "type": "integer",
    "description": "test for int"
   }
  ]
 };
bq.table.create(prjId, 'dataset_name', 'table_name', schema, function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});
```

## Get Table

```
bq.table.get(prjId, 'test123', 'table_name', function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});
```

## Delete Table

```
bq.table.delete(prjId, 'dataset_name', 'table_name', function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});
```

## Get Dataset

```
bq.dataset.get(prjId, 'dataset_name', function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});
```

## Delete Dataset

```
bq.dataset.delete(prjId, 'dataset_name', 'table_name2', function(e,r,d){
  if(e) console.log(e);
  console.log(d);
});
```
