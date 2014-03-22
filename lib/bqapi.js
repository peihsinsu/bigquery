/**
 * Configure the bigquery api
 */
var util = require('util')
  , auth = require('google-api-utility')
  , request = auth.request;

exports.init = auth.init;

/**
 * API job list
 */
exports.job  = {
  token: '',
  listds : function(project, cb){
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets';
    request({
        url: util.format(bqurl, project),
        method: 'GET'
    }, cb?cb:auth.commonCb);
  },
  query: function(project, bql, cb) {
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/queries';
    request({
        url: util.format(bqurl, project),
        method: 'POST',
        json: {
          query: bql
        }
    }, cb?cb:auth.commonCb);
  },
  load: function(project, datasetId, tableId, data, cb){
    //see: https://developers.google.com/bigquery/docs/reference/v2/tabledata/insertAll
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s/tables/%s/insertAll';
    var _data = {
      "kind": "bigquery#tableDataInsertAllRequest",
      "rows": data
    };
    request({
        url: util.format(bqurl, project, datasetId, tableId),
        method: 'POST',
        headers: {
          "Content-Type":  "application/json"
        },
        json: _data
    }, cb?cb:auth.commonCb);
    
  }
}

