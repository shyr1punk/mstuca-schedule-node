'use strict';

const request = require('request');
const iconv = require('iconv-lite');

const specialityUrls = require('./specialityUrls');
const getGroupURLMapping = require('./getGroupUrls').getGroupURLMapping;
const getScheduleFilesArray = require('./getGroupUrls').getScheduleFilesArray;

/**
 * Запускать для каждого URL xls файла группы
 */

specialityUrls.map(url => {
  request(encodeURI(url)).pipe(iconv.decodeStream('win1251')).collect(function(err, body) {
    const groups = getScheduleFilesArray(body);
    console.log(getGroupURLMapping(groups));
  });
})
