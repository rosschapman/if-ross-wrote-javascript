#! /usr/bin/env node
const actionFactory = require('./prompt');

let questions = [
  {
    dataKey: 'title',
    msg: 'What\'s the title?'
  },
];


return actionFactory({
  methodName: 'DELETE', 
  questions: questions
});