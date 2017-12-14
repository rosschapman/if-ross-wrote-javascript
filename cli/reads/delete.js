#! /usr/bin/env node
const actionFactory = require('./action-factory');

actionFactory(
  'DELETE', 
  'Ok, put the title here (but why did you add it in the first place??): \n'
);