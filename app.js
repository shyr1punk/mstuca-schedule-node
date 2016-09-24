const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    test: 1
  });
});

app.get('/groups', (req, res) => {
  MongoClient.connect(mongodbConnectUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const groups = db.collection('groups');
    groups.find({}).toArray((err, groups) => {
      assert.equal(null, err);
      assert.ok(groups != null);
      res.json(groups);
    });
  });
});

app.listen(3333, () => {
  console.log('Schedule app listen at 3333');
});
