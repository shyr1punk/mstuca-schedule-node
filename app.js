const mongoose = require('mongoose');
const express = require('express');

var Models = require('./models');
const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;

const { Faculty, Speciality, Group, Model } = Models;

const getSpecialityUrls = require('./saveGroupUrls');

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
    const responseData = {};
    responseData.faculties = results[0].map(faculty => ({
      short: faculty.short,
      _id: faculty._id
    }));
    responseData.specialities = results[1];
    responseData.groups = results[2];
    res.json(responseData);
  }).catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
});

app.get('/get-groups', (req, res) => {
  getSpecialityUrls((err, result) => {
    if(err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
})

app.listen(3333, () => {
  console.log('Schedule app listen at 3333');
});
