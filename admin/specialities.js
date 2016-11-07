'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const baseUrl = require('../config.js').baseUrl;

const getScheduleFilesUrls = require('../url-parser').getScheduleFilesUrls;

const models = require('../models');
const { Speciality, Group } = models;

const insertGroupsBySpecialityId = specialityId => {
  return Speciality.findOne({_id: specialityId})
    .populate('faculty')
    .then(speciality =>
      getScheduleFilesUrls(baseUrl + speciality.faculty.urlPart + speciality.short)
      .then(scheduleFilesUrls => ({
        speciality,
        scheduleFilesUrls
      }))
    )
    .then(({speciality, scheduleFilesUrls}) =>
      scheduleFilesUrls.map(group => ({
        short: group.group,
        url: group.url,
        speciality: speciality._id,
        faculty: speciality.faculty._id
      }))
    )
    .then(groups => {
      return Group.insertMany(groups)
    });
}


module.exports = {
  insertGroupsBySpecialityId
};
