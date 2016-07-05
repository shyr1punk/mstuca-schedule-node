'use strict';
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

/**
 * Поиск ссылок на скачиваемые расписания
 * 
 * @param {Array} groups
 * @returns
 */
function getGroupURLMapping(groups) {
  return groups
  // убираем ссылки на не элементы
  // TODO: сделать более интеллектуальным
  .filter(group => group.length === 3)
  .map(group => ({
    group: parseGroupName(group[0].ONCLICK),
    url: parseGroupURL(group[1].ONCLICK)
  }));
}

module.exports = {
  getGroupURLMapping,
  getScheduleFilesArray
};
