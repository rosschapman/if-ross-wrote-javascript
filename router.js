const db = require('./data/db');
const Notifications = require('./lib/notifications');
const Read = require('./models/read');
const Note = require('./models/note');

const Router = (request, response)=> {
  const { method, url } = request;
  res = response;
	res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  if (url === '/notes') {
    const collection = db.getDb().collection('notes');
    let body = [];

    if (method === 'POST') {
      request.on('data', (chunk) => {
        body.push(chunk)
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
				const newDocument = Note.create(JSON.parse(body));

        if (newDocument.isValid()) {
					newDocument.save()
						.then((result)=> {
							console.log('here')
						});
					
            
          // promise.then((result) => {
          //   // Ross: Alias attriubtes so don't have to do result.data???
          //   result.data.notes.push(newDocument._id);
          //   const promises = [result.save(), newDocument.save()];

          //   Promise.all([promises])
          //     .then((result) => {
          //       // Hmmm: not sure why but result.hasWriteError() isn't working
          //       if (result.writeErrors) { 
          //         console.log(err); 
          //         res.write(err);
          //       } else {
          //         // If we have a finish date, then send the notification
          //         if (newDocument.data.finishedAt) {
          //           Notifications.sendSMS(newDocument.saveSuccessMessage);
          //         }
          //         console.log(`Document was saved. ${result}`)
          //       }
          //       res.end();
          //     })
          //   ;
        } else {
          console.log(newDocument.errors)
          res.writeHead(400);
          res.write(JSON.stringify({errors: newDocument.errors}));
          res.end();
        }
      });
    }

    if (method === 'PATCH') {

    }

    if (method === 'DELETE') {

    }
  }

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
					const promise = Read.findOne({title: query});

					promise.then((result)=> {
						if (!result.data) {
							console.warn('Record not found')
							res.writeHead(404);
							res.write('Record not found');
							res.end();							
						} else {
							result.data = newData;
							result.update()
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
						const promise = Read.findOne(JSON.parse(body));
						
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
						const newDocument = Read.create(JSON.parse(body));

						if (newDocument.isValid()) {
							newDocument.save()
								.then((result) => {
									// Hmmm: not sure why but result.hasWriteError() isn't working
									if (result.writeErrors) { 
										console.log(err); 
										res.write(err);
									} else {
										// If we have a finish date, then send the notification
										if (newDocument.data.finishedAt) {
											Notifications.sendSMS(newDocument.saveSuccessMessage);
										}
										console.log(`Document was saved. ${result}`)
									}
									res.end();
								});
						} else {
							console.log(newDocument.errors)
							res.writeHead(400);
							res.write(JSON.stringify({errors: newDocument.errors}));
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
}

module.exports = Router;