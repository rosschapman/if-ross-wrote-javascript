const http = require('http');
const port = 3000;
const querystring = require('querystring');
const Store = require('./lib/store');
const Notifications = require('./lib/notifications');

// Ugggh want es6 modules so bad. Need to figure out the node-y way to load
// lots of things
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
		const collection = db.getDb().collection('reads');
		let body = [];

  	switch(method) {
			case 'DELETE':
				request
					.on('data', (chunk) => {
						console.log(chunk)
						body.push(chunk);
					})
					.on('end', () => { 
						body = Buffer.concat(body).toString();
						const record = Store.findDocument('reads', JSON.parse(body));
						
						record.then((record)=> {
							if (!record) {
								console.warn('Record not found')
								res.writeHead(404);
								res.write('Record not found');
								res.end();							
							} else {
								Store.destroyDocument('reads', record)
									.then((result) => {
										if (result.writeErrors) { 
											console.log(err); 
											res.write(err);
										} else {
											res.writeHead(200);
											res.write(`Document was deleted. ${result}`)
										}	
										res.end();
								});
							}
						});
					});
				break;
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

				request
					.on('data', (chunk) => {
						console.log(chunk)
				  	body.push(chunk);
					})
					.on('end', () => {
						body = Buffer.concat(body).toString();
						
						if (isJSON(body)) {
							const newRecord = Store.createDocument('read', JSON.parse(body));

							if (newRecord.isValid()) {
								Store.saveDocument('reads', newRecord)
									.then((result) => {
										// Hmmm: not sure why but result.hasWriteError() isn't working
										if (result.writeErrors) { 
											console.log(err); 
											res.write(err);
										} else {
											// If we have a finish date, then send the notification
											if (newRecord.data.finishedAt) {
												Notifications.sendSMS(newRecord.saveSuccessMessage);
											}
											res.writeHead(200);
											res.write(`Document was saved. ${result}`)
										}
										res.end();
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