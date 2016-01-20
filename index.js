var PythonShell = require('python-shell');

PythonShell.run('python/loader.py', {
  args: [
    'http://www.mstuca.ru/students/schedule/Факультет%20прикладной%20математики%20и%20вычислительной%20техники%20(ФПМиВТ)/ЭВМ/ЭВМб%202-1.xls'
  ]
}, function (err, data) {
  if (err) throw err;
  console.log(JSON.parse(data));
});
