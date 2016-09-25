"use strict";

var PythonShell = require('python-shell');

/**
 * Запуск Python парсера xls файла
 *
 * @param {string} xlsFileUrl
 */
function parseXlsFile(xlsFileUrl) {
  return new Promise((resolve, reject) => {
    PythonShell.run('python/loader.py', {
      args: [
        `http://www.mstuca.ru${xlsFileUrl}`
      ]
    }, function (err, data) {
      if (err) {
        reject(err);
      };
      resolve(JSON.parse(data));
    });
  });
}


module.exports = {
  parseXlsFile
};
