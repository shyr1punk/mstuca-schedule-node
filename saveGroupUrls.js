'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const async = require('async');

const getScheduleFilesUrls = require('./url-parser').getScheduleFilesUrls;
const specialityUrls = require('./url-parser/specialityUrls');

// Connection URL
const url = 'mongodb://localhost:27017/schedule';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  const collection = db.collection('groups');
  async.forEach(specialityUrls, (specialityUrl, callback) => {
    getScheduleFilesUrls(specialityUrl, groups => {
      const groupsCount = groups.length;
      if(!groupsCount) {
        callback();
        return;
      }
      collection.insertMany(groups, function(err, result) {
        assert.equal(err, null);
        assert.equal(groupsCount, result.result.n);
        assert.equal(groupsCount, result.ops.length);
        console.log(`Inserted ${groupsCount} groups into the groups collection`);
        callback();
      });
    });
  }, err => {
    db.close();
  });
});

