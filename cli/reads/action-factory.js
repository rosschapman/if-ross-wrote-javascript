#! /usr/bin/env node
const rl = require('readline');
const http = require('http');

function factory(methodName, promptMessage) {
  // Local settings
  const httpRequestOptions = {
    hostname: process.env.host,
    port: 3000,
    path: '/reads',
    method: methodName,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = http.request(httpRequestOptions, function(res) {
    res.setEncoding('utf8');
    let body = [];
    res
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('BODY', body)
    });
  }).on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
    
  r = rl.createInterface(process.stdin, process.stdout);
  
  let postData;
  r.question(promptMessage, (input) => { 
    // The server wants the data as a cute little string
    postData = input.toString();

  // Hmm wonder if there will ever be a race condition between these calls and process exits too early
    req.end(postData);
    r.close();
  });
  
  r.on('close', () => {
    console.log('Have a great day!');
    process.exit(0); // eslint-disable-line no-process-exit
  });
}

module.exports = factory;