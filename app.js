const http = require('http');
const port = 3000;
const querystring = require('querystring');
const Store = require('./data/store');
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
			case 'PATCH':
				request
				.on('data', (chunk) => {
					console.log(chunk)
					body.push(chunk);
				})
				.on('end', () => { 
					body = Buffer.concat(body).toString();
					const newData = JSON.parse(body);
					const query = newData.title; 
					const promise = Store.findDocument('read', {title: query});

					promise.then((result)=> {
						if (!result.data) {
							console.warn('Record not found')
							res.writeHead(404);
							res.write('Record not found');
							res.end();							
						} else {
							result.data = newData;
							result.save()
								.then((result) => {
									// Hmmm: not sure why but result.hasWriteError() isn't working
									if (result.writeErrors) { 
										console.log(err); 
										res.write(err);
									} else {
										// If we have a finish date, then send the notification
										if (newData.finishedAt) {
											Notifications.sendSMS(result.saveSuccessMessage);
										}
										res.writeHead(200);
										res.write(`Document was saved. ${result}`)
									}
									res.end();
								}
							);
						}
					});
				});
				break;
			case 'DELETE':
				request
					.on('data', (chunk) => {
						console.log(chunk);
						body.push(chunk);
					})
					.on('end', () => { 
						body = Buffer.concat(body).toString();
						console.log(body)
						const promise = Store.findDocument('read', JSON.parse(body));
						
						promise.then((document) => {
							if(!document.data) {
								console.warn('Record not found')
									res.writeHead(404);
									res.write('Record not found');
									res.end();							
							} else {
								document.destroy()
									.then((result) => {
										if (result.writeErrors) { 
											console.log(err); 
											res.write(err);
										} else {
											res.writeHead(200);
											res.write(`Document was deleted. ${document}`)
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
						const newRecord = Store.createDocument('read', JSON.parse(body));

						if (newRecord.isValid()) {
							newRecord.save()
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
										console.log(`Document was saved. ${result}`)
									}
									res.end();
								});
						} else {
							console.log(newRecord.errors)
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