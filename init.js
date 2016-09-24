var mongoose = require('mongoose');

var Models = require('./models');

const { Faculty, Speciality, Group, Model } = Models;

mongoose.connect('mongodb://localhost/schedule');

const faculties = [
  {
    short: 'МФ',
    full: 'Механический факультет',
    urlPart: 'Механический%20факультет/'
  }, {
    short: 'ФАСК',
    full: 'Факультет авиационных систем и комплексов',
    urlPart: 'Факультет%20авиационных%20систем%20и%20комплексов%20(ФАСК)/'
  }, {
    short: 'ФПМИВТ',
    full: 'Факультет прикладной математики и вычислительной техники',
    urlPart: 'Факультет%20прикладной%20математики%20и%20вычислительной%20техники%20(ФПМиВТ)/'
  }, {
    short: 'ФУВТ',
    full: 'Факультет управления на воздушном транспорте',
    urlPart: 'Факультет%20управления%20на%20воздушном%20транспорте%20(ФУВТ)/'
  }
].map(faculty => new Faculty(faculty));

Faculty.insertMany(faculties, (err, docs) => {
    if (err) {
        console.log('Faculty insert error');
        console.log(err);
    } else {
      console.log(docs);
        console.info('%d faculties were successfully stored.', docs.length);
    }
});

const specialities = [
  {
    short: 'БТП',
    faculty: faculties[0]
  }, {
    short: 'M',
    faculty: faculties[0]
  }, {
    short: 'РС',
    faculty: faculties[1]
  }, {
    short: 'УВД',
    faculty: faculties[1]
  }, {
    short: 'АК',
    faculty: faculties[1]
  }, {
    short: 'ЭВМ',
    faculty: faculties[2]
  }, {
    short: 'ПМ',
    faculty: faculties[2]
  }, {
    short: 'БИ',
    faculty: faculties[2]
  }, {
    short: 'ОП',
    faculty: faculties[3]
  }, {
    short: 'СО',
    faculty: faculties[3]
  }, {
    short: 'ЭК',
    faculty: faculties[3]
  }
].map(speciality => new Speciality(speciality));

Speciality.insertMany(specialities, (err, docs) => {
    if (err) {
        console.log('Speciality insert error');
        console.log(err);
    } else {
      console.log(docs);
        console.info('%d specialities were successfully stored.', docs.length);
    }
});

mongoose.connection.close();
