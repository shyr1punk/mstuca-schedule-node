/**
 * Соединяемся с БД и читаем сслыки на xls файлы
 */

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const async = require('async');

const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;

const parseXlsFile = require('./file-parser').parseXlsFile;

MongoClient.connect(mongodbConnectUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  const groups = db.collection('groups');
  groups.find({}).limit(1).toArray((err, docs) => {
    assert.equal(null, err);
    assert.ok(docs != null);
    parseXlsFile(docs[0].url, (err, lessons) => {
      // удаляем предыдущие записи группы
      const lessonsCollection = db.collection('lessons');
      lessonsCollection.deleteMany({
        groupId: docs[0]._id
      });
      // добавляем groupId
      const lessonsWithGroup = lessons.map(lesson => Object.assign({}, lesson, {groupId: docs[0]._id}));
      // записываем уроки в базу
      lessonsCollection.insertMany(lessonsWithGroup, (err, result) => {
        assert.equal(err, null);
        assert.equal(lessons.length, result.result.n);
        assert.equal(lessons.length, result.ops.length);
        console.log(`Inserted ${lessons.length} lessons into the lessons collection`);
        db.close();
      });
    });
  });
});
