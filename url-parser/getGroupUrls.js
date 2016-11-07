'use strict';

const http = require('http');

/**
 * Парсинг страницы с расписаниями для получения массива ссылок на файлы с расписанием
 *
 * @param {string} pageBody html код страницы сайта университета с расписаниями группы
 * @returns
 */
function getScheduleFilesArray(pageBody) {
  const arrayIdentifier = 'bxGrid_WebDAV24.oActions = ';
  const nextIdentifiyer = 'bxGrid_WebDAV24.oColsMeta';

  //determine WebDAV files array start position and trim begin of file
  const arrayIdentifierPosition = pageBody.search(arrayIdentifier);
  if(arrayIdentifierPosition === -1) {
    console.error('Не найдена начальная позиция массива групп в JS файле');
    return [];
  }
  let arraySource = pageBody.slice(arrayIdentifierPosition + arrayIdentifier.length);

  //determine WebDAV files array last position and trim end of file
  const nextIdentifiyerPosition = arraySource.search(nextIdentifiyer);
    if(nextIdentifiyerPosition === -1) {
    console.error('Не найдена конечная позиция массива групп в JS файле');
    return [];
  }
  arraySource = arraySource.slice(0, nextIdentifiyerPosition - 1);

  //eval is evil, but its very simple way
  //TODO: change to String.replace
  let result = [];
  try {
    result = eval(arraySource);
  } catch (e) {
    console.error(e);
    console.error(arraySource);
  } finally {
    return result;
  }
}

/**
 * Парсинг имени группы из ссылки на скачивание
 *
 * @param {String|*} url Строка со ссылкой на скачивание файла, собержащая имя группы
 * @example 'OpenDoc(\'/students/schedule/Факультет управления на воздушном транспорте (ФУВТ)/ЭК/ЭКб 4-2.xls\', true);'
 *
 * @returns {String|null} Имя группы или null в случае отсутствия имени группы в строке
 */
function parseGroupName(url) {
  if(typeof url !== 'string') {
    console.error('Парсинг имени группы: переданные параметр не является строкой');
    return null;
  }
  const match = url.match(/\/(?:.+\/)(.+)\.xls/);
  if(!match) {
    console.error('Парсинг имени группы: переданная строка не содержит имя группы. url = ' + url);
    return null;
  }
  // Первая захватываемая группа в регулярном выражении содержит имя группы
  return match[1];
}

/**
 * example input 'window.location.href = \'/students/schedule/webdav_bizproc_history_get/31570/31570/?force_download=1\';'
 */
function parseGroupURL(raw) {
  return raw.replace('window.location.href = \'', '').replace('\';', '');
}

/**
 * Поиск ссылок на скачиваемые расписания
 *
 * @param {Array} groups
 * @returns
 */
function getGroupURLMapping(groups) {
  return groups
  // если длина массива === 3 - значит это ссылка на файл
  .filter(group => group.length === 3)
  .map(group => {
    const groupName = parseGroupName(group[0].ONCLICK);
    // Если имя группы null - значит это не группа
    if(!groupName) {
      return null;
    }
    return {
      group: groupName,
      url: parseGroupURL(group[1].ONCLICK)
    }
  })
  // если элемент массива null - значит не удалось установить имя группы - это ссылка на другой файл
  .filter(group => group != null);
}

module.exports = {
  getGroupURLMapping,
  getScheduleFilesArray
};
