const mongoose = require('mongoose');
const express = require('express');

var Models = require('./models');
const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;

const { Faculty, Speciality, Group, Model } = Models;

const app = express();

app.get('/', (req, res) => {
  res.json({
    test: 1
  });
});

app.get('/menu', (req, res) => {
  mongoose.connect(mongodbConnectUrl);
  Faculty.find({}).then(result => {
    const responseData = {
      groups: [] // TODO: заменить на реальные данные
    };
    responseData.faculties = result.map(faculty => ({
      short: faculty.short,
      _id: faculty._id
    }));
    Speciality.find({}).exec().then(result => {
      responseData.specialities = result;
      res.json(responseData);
      mongoose.connection.close();
    }).catch(err => {
      console.log(err);
      mongoose.connection.close();
    });
  }).catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
});

app.listen(3333, () => {
  console.log('Schedule app listen at 3333');
});
