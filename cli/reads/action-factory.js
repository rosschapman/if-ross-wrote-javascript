#! /usr/bin/env node
const readline = require('readline');
const http = require('http');

function factory(options) {
  // Local settings 
  const methodName = options.methodName;
  const questions = options.questions;
  const httpRequestOptions = {
    hostname: process.env.host,
    port: 3000,
    path: '/reads',
    method: methodName,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = http.request(httpRequestOptions, function noop() { 
    // TODO: since we exit process right after sending request, we need another
    // way to receive communication, possibly Twilio. This is actually 
    // interesting because we are not in the browser per normal where it's easy 
    // to rely on 
  }).on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
  const resetColor = '\x1b[0m';
  const promptPrefix = `?`;
  const noRegExp = /^(n\b|no\b)/;
  const yesRegExp = /^(y\b|yes\b)/;
  let postData = {};
  let counter = 0;
  let questionsLen = questions.length - 1;
  let firstQuestion = questions[0];
  let questionColor = '\x1b[92m';
  let currentQuestion = firstQuestion;
  let nextQuestion = questions[1];
  
  // Format questions: add color and trailing space
  for(let i = 0; i < questions.length; i++) {
    questions[i].msg = `${questionColor}${questions[i].msg}${resetColor} `;
  }
 
  rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout, 
    prompt: `${promptPrefix} ${firstQuestion.msg}`
  });

  rl.prompt();

  rl.on('line', (input) => {
    if (noRegExp.test(input.toLowerCase())) {
      --counter;
      rl.setPrompt(`${promptPrefix} ${questionColor}Re-enter ${currentQuestion.dataKey}:${resetColor} `);
      rl.prompt();
      nextQuestion = questions[++counter];
      currentQuestion = questions[counter];
    } else if (yesRegExp.test(input.toLowerCase())) {
      nextQuestion = questions[++counter];
      currentQuestion = questions[counter];
      rl.setPrompt(`${promptPrefix} ${nextQuestion.msg}`);
      rl.prompt();
    } else {
      // TODO: gonna need to DRY once we add another object as data property
      if (currentQuestion.dataKey === 'author') {
        postData[currentQuestion.dataKey] = {
          firstName: input.split(',')[0].trim(),
          lastName: input.split(',')[1].trim()
        }
      } else {
        postData[currentQuestion.dataKey] = input;
      }
      
      if (counter === questionsLen) {  
        req.end(postData.toString());
        rl.close();
      }

      rl.setPrompt(`${promptPrefix} ${questionColor}Does that look right?${resetColor} `);
      rl.prompt();
    }
  });
    
  rl.on('close', () => {
    console.log('Have a great day!');
    process.exit(0); // eslint-disable-line no-process-exit
  });
}

module.exports = factory;