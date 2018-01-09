#! /usr/bin/env node
const readline = require('readline');
const http = require('http');

function factory(options) {
  // Local settings 
  const { methodName, questions } = options;
  const resetColor = '\x1b[0m';
  const questionColor = '\x1b[92m'; // light green
  const promptPrefix = `?`;
  const noRegExp = /^(n\b|no\b)/;
  const yesRegExp = /^(y\b|yes\b)/;
  let postData = {};
  let counter = 0;
  let questionsSize = questions.length === 1 ? 1 : questions.length - 1;
  let firstQuestion = questions[0];
  let currentQuestion = firstQuestion;
  let nextQuestion = questions[1];
  let currentPromptType;

  function sendData(data) {
    let payload = JSON.stringify(data);
    const httpRequestOptions = {
      hostname: process.env.host || 'localhost',
      port: 3000,
      path: '/reads',
      method: methodName,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(httpRequestOptions, (res) => { 
      let body = [];
      res
        .on('data', (chunk) => {
          // TODO: do something with this later
          body.push(chunk);
        })
        .on('end', () => {
          // TODO: add Twilio notificaton here? 
          rl.close();
        });
    });

    req.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    })
    req.end(payload);
  }
  
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

  rl.on('line', input => {
    let lowerInput = input.toLowerCase();
    
    if (currentPromptType === 'userValidate') {
      currentPromptType = 'question';
      if (!(noRegExp.test(lowerInput) || yesRegExp.test(lowerInput))) {
        console.log('here')
        rl.setPrompt(`${promptPrefix} ${questionColor}Whoops, I don't know what you mean? Try again with "y" or "n":${resetColor} `);
        rl.prompt();
      }
    }

    if (noRegExp.test(lowerInput)) {
      rl.setPrompt(`${promptPrefix} ${questionColor}Re-enter ${currentQuestion.dataKey}:${resetColor} `);
      rl.prompt();
      nextQuestion = questions[counter];
      currentQuestion = questions[counter];
    } else if (yesRegExp.test(lowerInput)) {
      nextQuestion = questions[++counter];
      currentQuestion = questions[counter];

      if (nextQuestion) {
        rl.setPrompt(`${promptPrefix} ${nextQuestion.msg}`);
        rl.prompt();
      } else {
        sendData(postData);
      }
    } else {
      // TODO: gonna need to DRY once we add another object as data property
      if (currentQuestion.dataKey === 'author') {
        postData[currentQuestion.dataKey] = {
          firstName: input.split(',')[0].trim(),
          lastName: input.split(',')[1].trim()
        }
      } else {
        if (/^now$/.test(input)) {
          input = new Date();
        }
        postData[currentQuestion.dataKey] = input;
      }
      
      if (counter === questionsSize) {  
        sendData(postData);
      } else {
        rl.setPrompt(`${promptPrefix} ${questionColor}Does that look right?${resetColor} `);
        rl.prompt();
        currentPromptType = 'userValidate';
      }
    }
  });

  rl.on('close', () => {
    console.log('Have a great day!');
    process.exit(0); // eslint-disable-line no-process-exit
  });
}

module.exports = factory;