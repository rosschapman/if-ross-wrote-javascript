const http = require('http');
const port = 3000;
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const querystring = require('querystring');
const ReadingMaterial = require('./reading-material');

// DB
const url = 'mongodb://localhost:27017/deployed-to-prod';
let db = null;

const server = http.createServer((request, response) => {
  const { method, url } = request;
  res = response;
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

	// There's only one route at the mo so like fuck a router
  if (url === '/reading-materials-manager') {
  	const collection = db.collection('reading-materials');

  	switch(method) {
  		case 'GET':
		  	res.writeHead(200, {
		  		"Content-Type": "application/json"
		  	});

		  	collection
		  		.find({})
		  		.project({_id: 0 })
		  		.toArray(function(err, docs) {
				  	res.write(JSON.stringify(docs));
				  	res.end();
				  });
				break;
			case 'POST':
				console.log('here')
				// The Dharmakaya--"truth body"--is the basis of the original unbornness.
				let body = [];

				request
					.on('data', (chunk) => {
						console.log(chunk)
				  	body.push(chunk);
					})
					.on('end', () => {
				  	body = Buffer.concat(body).toString();
				  	const newRecord = new ReadingMaterial('reading-materials', JSON.parse(body));
				  	console.log("RECORD", newRecord)
						
				  	if (newRecord.isValid()) {
					  	newRecord.save('reading-materials').then((result) => {
					  		// Hmmm: not sure why but result.hasWriteError() isn't working
					    	if (result.writeErrors) { 
					    		console.log(err); 
					    		res.write(err);
					    		res.end();
					    	} else {
					      	res.writeHead(201);
					      	res.write(`Success yo! ${result}`)
					      	res.end();
					    	}
					  	});
						} else {
							res.writeHead(400);
							res.write(JSON.stringify({errors: newRecord.errors}));
							res.end();
						}

					})
					.on('error', (err) => {
  					console.error(err.stack);
					});
				break;
			default:
				console.log('Why are we even here?')
  	}
  }
});


MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  db = database;
  
  console.log("The connection has been made to the database, k thx.");
});

server.listen(port, (err) => {
  if (err) {
    return console.log('Ross, did you break the \'net?', err)
  }

  console.log(`The server is listening for your sweet nothings on ${port}`)
})