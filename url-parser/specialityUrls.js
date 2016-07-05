'use strict';

/**
 * Объект со списком всех специальностей
 * @type {Object}
 */
const urlObject = {
  'http://www.mstuca.ru/students/schedule/': {
    'Механический%20факультет/': [
      'БТП',
      'M'
    ],
    'Факультет%20авиационных%20систем%20и%20комплексов%20(ФАСК)/': [
      'РС',
      'УВД',
      'АК'
    ],
    'Факультет%20прикладной%20математики%20и%20вычислительной%20техники%20(ФПМиВТ)/': [
      'ЭВМ',
      'ПМ',
      'БИ'
    ],
    'Факультет%20управления%20на%20воздушном%20транспорте%20(ФУВТ)/': [
      'ОП',
      'СО',
      'ЭК'
    ]
  },
};

/**
 * Функция получения массива ссылок на страницы специальностей
 * @param  {Object} urlObject Объект со структурой групп
 * @return {Array.<string>} Массив ссылок на страницы специальностей
 */
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

module.exports = getSpecialityPageUrls(urlObject);
