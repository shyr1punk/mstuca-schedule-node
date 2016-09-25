const parseXlsFile = require('./index').parseXlsFile;
const Lesson = require('../models').Lesson;

module.exports = (xlsFileUrl) => {
  return parseXlsFile(xlsFileUrl);
};
