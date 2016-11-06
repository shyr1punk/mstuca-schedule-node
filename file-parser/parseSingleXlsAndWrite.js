const moment = require('moment');
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const parseXlsFile = require('./index').parseXlsFile;
const models = require('../models');
const { Group, Lesson } = models;

/**
 * Ищем группу по ID
 * Получаем url группы
 * Парсим полученный по url файл с расписанием
 * Формируем массив новых занятий для группы
 * Удаляем старые занятия группы
 * Вставляем новые занятия
 *
 * @param {String} groupId
 *
 * @returns {Promise}
 */
module.exports = (groupId) => {
  return Group.findById(groupId)
    .then(group => parseXlsFile(group.url))
    /**
     * Подготавливаем документы для записи
     * @type {Lesson[]}
     */
    .then(singleGroupLessons => {
      /**
       * Массив занятий, готовый к записи в БД
       * @type {Lesson[]}
       */
      const lessonsReadyToDB = singleGroupLessons.map(lesson => {
        lesson.date = moment(lesson.date).toDate();
        lesson.group = groupId;
        return lesson;
      });
      return lessonsReadyToDB;
    })
    /**
     * Удаляем предыдущие занятия группы
     * @type {Lesson[]}
     */
    .then(lessonsReadyToDB => {
      return Lesson.remove({group: groupId})
        .then(result => {
          console.log(`Removed ${result.result.n} lessons for groupId ${groupId}`);
          return lessonsReadyToDB;
        }, err => err)
    })
    /**
     * Вставляем новые занятия
     * @type {Object} Результат операции insertMany
     */
    .then(lessonsReadyToDB => Lesson.insertMany(lessonsReadyToDB))
    /**
     * Обновляем информацию о количестве записей для группы
     */
    .then(result => {
      console.log(`Inserted ${result.length} lessons for groupId ${groupId}`);
      return Group
        .findByIdAndUpdate(groupId, {
          $set: { lessonsCount: result.length }
        }, {
          new: true
        })
    })
    .then(result => {
      console.log('Update lessonsCount complete');
      return result.length;
    }, err => {
      console.log('Update lessonsCount failed');
      console.log(err);
      return result.length;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};


/**
 * Одно занятие
 *
 * @typedef {Object} Lesson
 *
 * @property {Number} sub_group - подгруппа
 * @property {String} auditory - аудитория,
 * @property {String} lesson_type - тип занятия
 * @property {Number} number - номер пары
 * @property {Date} date - дата
 * @property {String} teacher - преподаватель
 * @property {String} subject - предмет
 * @property {String} group - MongoDB идентификатор группы
 */
