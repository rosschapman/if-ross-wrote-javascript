#! /usr/bin/env node
const actionFactory = require('./action-factory');

let questions = [
  {
    dataKey: 'title',
    msg: 'What\'s the title?'
  },
  {
    dataKey: 'author',
    msg: 'What\'s the author\'s name? <fmt: lastName, firstName>'
  },
  // TODO
  // {
  //   dataKey: 'note',
  //   msg: 'Add a note? '
  // }
];

return actionFactory({
  methodName: 'POST', 
  questions: questions
});