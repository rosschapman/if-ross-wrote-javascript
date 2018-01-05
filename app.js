const http = require('http');
const port = 3000;
const Router = require('./router');

// Ugggh want es6 modules so bad. Need to figure out the node-y way to load
// lots of things
const db = require('./data/db');
const isJSON = require('./lib/is-json');

const server = http.createServer();

server.on('request', (request, response) => {
  Router(request, response);
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