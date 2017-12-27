#! /usr/bin/env node
const actionFactory = require('./prompt');

let questions = [
  {
    dataKey: 'title',
    msg: 'What\'s the title?'
  },
  {
    dataKey: 'finishedAt',
    msg: 'When did you finish it?'
  },
  // TODO
  // {
  //   dataKey: 'note',
  //   msg: 'Add a note? '
  // }
];

return actionFactory({
  methodName: 'PATCH', 
  questions: questions
});