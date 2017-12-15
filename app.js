const http = require('http');
const port = 3000;
const querystring = require('querystring');
const ReadModel = require('./models/read');

// Ugggh want es6 modules so bad. Need to figure out the node-y way to load more things at once.
const db = require('./lib/db');
const isJSON = require('./lib/is-json');

const server = http.createServer();

server.on('request', (request, response) => {
  const { method, url } = request;
  res = response;
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

	// There's only one route at the mo so like fuck a router
  if (url === '/reads') {
  	const collection = db.getDb().collection('reading-materials');

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
				// The Dharmakaya--"truth body"--is the basis of the original unbornness.
				let body = [];

				request
					.on('data', (chunk) => {
						console.log(chunk)
				  	body.push(chunk);
					})
					.on('end', () => {
						body = Buffer.concat(body).toString();
						
						if (isJSON(body)) {
							const newRecord = ReadModel(data: JSON.parse(body));
							if (newRecord.isValid()) {
								newRecord.save((writeResult) => { 
									// TODO: This might be too simple, implemented circa 11:30pm
									if (newRecord.data.finishedAt) {
										newRecord.sendSmsCongrats();
									}
								});
							} else {
								console.log(newRecord.errors)
								res.writeHead(400);
								res.write(JSON.stringify({errors: newRecord.errors}));
								res.end();
							}
						} else {
							console.warn('Invalid JSON')
							res.writeHead(400);
							res.write('Invalid JSON');
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

db.connect(
	function() {
		server.listen(port, (err) => {
		  if (err) {
		    console.log('Ross, did you break the \'net?', err);
		  }

		  console.log(`The server is listening for your sweet nothings on ${port}`);
		});
	},
	function(err) {
		if (err) {
			console.log('DB didn\'t start:', err);
		}
	}
);