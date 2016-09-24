'use strict';

const mongoose = require('mongoose');

const mongodbConnectUrl = require('./config.js').mongodbConnectUrl;
const baseUrl = require('./config.js').baseUrl;

const getScheduleFilesUrls = require('./url-parser').getScheduleFilesUrls;

const models = require('./models');
const { Speciality, Group } = models;


/**
 * (specialityUrl, index) => ({
   url: getScheduleFilesUrls(specialityUrl),
   speciality: specialities[index]._id,
   faculty: specialities[index].faculty._id
 })
*/
const getSpecialityUrls = callback => {
  mongoose.connect(mongodbConnectUrl);
  Speciality.find({})
    .populate('faculty')
    .then(specialities => {
      const specialityUrls = specialities.map(speciality =>
        baseUrl + speciality.faculty.urlPart + speciality.short
      );
      Promise.all(specialityUrls.map(specialityUrl =>
        getScheduleFilesUrls(specialityUrl)
      )).then(results => {
        const groups = results.reduce((element, result) => {
          result = result.concat(element);
          return result;
        }, []);
        callback(null, groups);
        mongoose.connection.close();
      }, err => {
        console.log(err);
        mongoose.connection.close();
      });
    }, err => {
      callback(err);
      mongoose.connection.close();
    });
}

module.exports = getSpecialityUrls;
