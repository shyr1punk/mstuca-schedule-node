"use strict";

var PythonShell = require('python-shell');

/**
 * Запуск Python парсера xls файла
 * 
 * @param {string} xlsFileUrl
 * @param {Function} callback
 */
function parseXlsFile(xlsFileUrl, callback) {
  PythonShell.run('python/loader.py', {
    args: [
      `http://www.mstuca.ru${xlsFileUrl}`
    ]
  }, function (err, data) {
    if (err) {
      callback(err);
    };
    callback(null, JSON.parse(data));
  });
}


module.exports = {
  parseXlsFile
};