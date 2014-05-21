/**
 * Configure the bigquery api
 */
var util = require('util')
  , auth = require('google-api-utility')
  , request = auth.request
  , _ = require('underscore')

exports.init = function(opts) {
	if(!opts) {
		console.log('no init setup...');
		return;
	}
	if(!opts.scope) {
		opts.scope = 'https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/cloud-platform'
	}
	auth.init(opts);
}

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

exports.dataset = {
	list : function(project, cb){
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets';
    request({
        url: util.format(bqurl, project),
        method: 'GET'
    }, cb?cb:auth.commonCb);
  },
  create: function(projectId, datasetId, opts, cb) {
    var callback, _opts;
    if(typeof(opts) == 'function') {
      callback = opts;
      _opts = {}
    } else {
      callback = cb;
      _opts = opts;
    }
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets';
    _opts["datasetReference"] = {
      "datasetId": datasetId,
      "projectId": projectId
    }
    
    request({
        url: util.format(bqurl, projectId),
        method: 'POST',
        headers: {
          "Content-Type":  "application/json"
        },
        json: _opts
    }, callback?callback:auth.commonCb);
  },
  delete: function(projectId, datasetId, callback) {
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s';
    request({
        url: util.format(bqurl, projectId, datasetId),
        method: 'DELETE'
    }, callback?callback:auth.commonCb);
  },
  get: function(projectId, datasetId, callback) {
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s';
    request({
        url: util.format(bqurl, projectId, datasetId),
        method: 'GET'
    }, callback?callback:auth.commonCb);
  }
}

exports.table = {
  create: function(projectId, datasetId, tableId, schemaObj, _opts, cb) {
    var callback, opts;
    if(typeof(_opts) == 'function') {
      callback = _opts;
      opts = {}
    } else {
      callback = cb;
      opts = _opts;
    }
    var data = {
      "kind": "bigquery#table",
      "schema": schemaObj,
      "tableReference": {
        "datasetId": datasetId,
        "projectId": projectId,
        "tableId": tableId
      }
    };
    data = _.extend(data, opts);
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s/tables';
    request({
        url: util.format(bqurl, projectId, datasetId),
        method: 'POST',
        headers: {
          "Content-Type":  "application/json"
        },
        json: data
    }, callback?callback:auth.commonCb);
  },
  delete: function(projectId, datasetId, tableId, callback) {
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s/tables/%s';
    request({
        url: util.format(bqurl, projectId, datasetId, tableId),
        method: 'DELETE'
    }, callback?callback:auth.commonCb);
  },
  get: function(projectId, datasetId, tableId, callback) {
    var bqurl = 'https://www.googleapis.com/bigquery/v2/projects/%s/datasets/%s/tables/%s';
    request({
        url: util.format(bqurl, projectId, datasetId, tableId),
        method: 'GET'
    }, callback?callback:auth.commonCb);
  }
}

