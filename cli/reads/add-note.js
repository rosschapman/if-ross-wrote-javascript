#! /usr/bin/env node
const actionFactory = require('./prompt');

let questions = [
  {
    dataKey: 'parentId',
    msg: 'What\'s the read ID?'
  },
  {
    dataKey: 'text',
    msg: 'What\'s the author\'s name? <fmt: lastName, firstName>'
  },
];

return actionFactory({
  methodName: 'POST', 
  questions: questions
});