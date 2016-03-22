'use strict';

const request = require('request');
var iconv = require('iconv-lite');

const scheduleFilesPages = require('./url');
const url = 'http://www.mstuca.ru/students/schedule/Факультет%20управления%20на%20воздушном%20транспорте%20(ФУВТ)/ЭК';

function getSpecialityPageUrls(urlObject) {
  const urls = [];
  Object.keys(urlObject).map(baseUrl => {
    Object.keys(urlObject[baseUrl]).map(facultyUrl => {
      urlObject[baseUrl][facultyUrl].map(specialityUrl => {
        urls.push(baseUrl + facultyUrl + specialityUrl);
      });
    });
  });
  return urls;
}

function getScheduleFilesArray(pageBody) {
  const arrayIdentifier = 'bxGrid_WebDAV24.oActions = ';
  const nextIdentifiyer = 'bxGrid_WebDAV24.oColsMeta';

  //determine WebDAV files array start position and trim begin of file
  let arraySource = pageBody.slice(pageBody.search(arrayIdentifier) + arrayIdentifier.length);

  //determine WebDAV files array last position and trim end of file
  arraySource = arraySource.slice(0, arraySource.search(nextIdentifiyer) - 1);

  //eval is evil, but its very simple way
  //TODO: change to String.replace
  return eval(arraySource);
}

/**
 * example input 'OpenDoc(\'/students/schedule/Факультет управления на воздушном транспорте (ФУВТ)/ЭК/ЭКб 4-2.xls\', true);'
 */
function parseGroupName(raw) {
  let result = raw.slice(0, raw.search('.xls'));
  for (let i = result.length; i !== 0; i--) {
    if(result[i] == '/') {
      return result.slice(i + 1);
    }
  }
  console.error('Cannot determine group from raw string: ' + raw);
  return result;
}

/**
 * example input 'window.location.href = \'/students/schedule/webdav_bizproc_history_get/31570/31570/?force_download=1\';'
 */
function parseGroupURL(raw) {
  return raw.replace('window.location.href = \'', '').replace('\';', '');
}

function getGroupURLMapping(scheduleFilesArray) {
  const map = scheduleFilesArray
    .map(item => {
      const groups = item.filter(item => item.length !== 0);
      return groups.map(group => ({
        group: parseGroupName(group[0].ONCLICK),
        url: parseGroupURL(group[1].ONCLICK)
      }));
    });
  return map;
}

request(encodeURI(url)).pipe(iconv.decodeStream('win1251')).collect(function(err, body) {
  const groups = [getScheduleFilesArray(body)];
  console.log(getGroupURLMapping(groups));
});
