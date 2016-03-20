'use strict';

const request = require('request');

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
  const arrayIdentifier = 'bxGrid_WebDAV24\.oActions = ';
  const nextIdentifiyer = 'bxGrid_WebDAV24.oColsMeta';

  //determine WebDAV files array start position and trim begin of file
  let arraySource = pageBody.slice(pageBody.search(new RegExp(arrayIdentifier)) + arrayIdentifier.length);

  //determine WebDAV files array last position and trim end of file
  arraySource = arraySource.slice(0, arraySource.search(new RegExp(nextIdentifiyer)) - 1);

  //eval is evil, but its very simple way
  //TODO: change to String.replace
  return eval(arraySource);
}

request(encodeURI(url), function(err, resp, body) {
  if(err) {
    console.log(err);
    return;
  }
  const groups = getSpecialityPageUrls(scheduleFilesPages).map(item => getScheduleFilesArray(body))
  console.log(groups);
});
