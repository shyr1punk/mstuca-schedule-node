'use strict';

const request = require('request');
const iconv = require('iconv-lite');

const getGroupURLMapping = require('./getGroupUrls').getGroupURLMapping;
const getScheduleFilesArray = require('./getGroupUrls').getScheduleFilesArray;

function getScheduleFilesUrls(specialityUrls, callback) {
  return new Promise((resolve, reject) => {
    request(encodeURI(specialityUrls)).pipe(iconv.decodeStream('win1251')).collect(function(err, body) {
      const groups = getScheduleFilesArray(body);
      resolve(getGroupURLMapping(groups));
    });
  });
}

module.exports = {
  getScheduleFilesUrls
}
