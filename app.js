const mongoose = require('mongoose');
const express = require('express');

var Models = require('./models');
const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;

const { Faculty, Speciality, Group, Model, Lesson } = Models;

const getSpecialityUrls = require('./saveGroupUrls');
const parseSingleXlsAndWrite = require('./file-parser/parseSingleXlsAndWrite');

const app = express();

app.get('/', (req, res) => {
  res.json({
    test: 1
  });
});

app.get('/menu', (req, res) => {
  mongoose.connect(mongodbConnectUrl);
  Promise.all([
    Faculty.find({}),
    Speciality.find({}),
    Group.find({})
  ]).then(results => {
    mongoose.connection.close();
    res.json({
      faculties: results[0],
      specialities: results[1],
      groups: results[2]
    });
  }).catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
});

app.get('/schedule/:groupId', (req, res) => {
  mongoose.connect(mongodbConnectUrl);
  Lesson.find({group: req.params.groupId}).then(
    lessons => {
      mongoose.connection.close();
      res.send(lessons);
    },
    err => {
      mongoose.connection.close();
      res.send(err);
    }
  );
});

app.get('/admin/insert-groups', (req, res) => {
  getSpecialityUrls((err, result) => {
    if(err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
});

app.get('/admin/groups', (req, res) => {
  mongoose.connect(mongodbConnectUrl);
  Group.find({}).then(groups => {
    mongoose.connection.close();
    res.json(groups);
  }, err => {
    mongoose.connection.close();
    res.send(err);
  });
});

app.get('/admin/groups/:id/update', (req, res) => {
  if(typeof req.params.id === 'string') {
    parseSingleXlsAndWrite(req.params.id)
      .then(
        insertedCount => {
          res.json({
            result: 'OK',
            groupId: req.params.id,
            insertedCount
          });
        },
        mongooseErr => {
          res.json({
            result: 'ERROR',
            mongooseErr
          });
        }
      );
  } else {
    res.json({
      error: `:id parameter is invalid. Got ${req.params.id}`
    })
  }
});

app.listen(3333, () => {
  console.log('Schedule app listen at 3333');
});
