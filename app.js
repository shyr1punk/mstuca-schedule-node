const mongoose = require('mongoose');
const express = require('express');

var Models = require('./models');
const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;

const { Faculty, Speciality, Group, Model, Lesson } = Models;

const getSpecialityUrls = require('./saveGroupUrls');
const parseSingleXlsAndWrite = require('./file-parser/parseSingleXlsAndWrite');

const app = express();

mongoose.connect(mongodbConnectUrl);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongodbConnectUrl);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

app.get('/', (req, res) => {
  res.json({
    test: 1
  });
});

app.get('/api/menu', (req, res) => {
  Promise.all([
    Faculty.find({}),
    Speciality.find({}),
    Group.find({}),
    Lesson.find().distinct('teacher')
  ]).then(results => {
    res.json({
      faculties: results[0],
      specialities: results[1],
      groups: results[2],
      teachers: results[3].sort()
    });
  }).catch(err => {
    console.log(err);
  });
});

app.get('/api/schedule/groups/:groupId', (req, res) => {
  Lesson.find({group: req.params.groupId}).then(
    lessons => {
      res.send(lessons);
    },
    err => {
      res.send(err);
    }
  );
});

app.get('/api/schedule/teachers/:teacherName', (req, res) => {
  Lesson.find({teacher: req.params.teacherName}).then(
    lessons => {
      res.send(lessons);
    },
    err => {
      res.send(err);
    }
  );
})

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
  Group.find({}).then(groups => {
    res.json(groups);
  }, err => {
    res.send(err);
  });
});


app.get('/admin/specialities', (req, res) => {
  Promise.all([
    Speciality.find({}),
    Group.aggregate([{$group: {_id: '$speciality', count: {$sum: 1}}}])
  ]).then(results => {
    const specialities = results[0];
    const groupsCountBySpecialityId = results[1].reduce((prev, curr) => {
      prev[curr._id] = curr.count;
      return prev;
    }, {});
    res.json(specialities.map(speciality =>
      Object.assign({}, speciality.toObject(), {groupsCount: groupsCountBySpecialityId[speciality._id] || 0})
    ));
  }, err => {
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
