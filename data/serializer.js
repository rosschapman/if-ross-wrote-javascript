const ObjectID = require('mongodb').ObjectID;

const Serializer = {
  serialize: (object) => {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {

        if (/id$/i.test(key)) {
          object[key] = new ObjectID(object[key]);
        }
        
        if (/At$/.test(key)) {
          object[key] = new Date(Date.parse(object[key]));
        }
      }
    }
    return object;
  },
  sanitize(data) {
		let sanitized = {};
		for (const key in data) {
			// Kill the $ mongo exploit
			// More here: https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
			if (/^\$/.test(key)) {
				console.log(`Leslie NOPE, this key:${key} is dangerous`)
				delete data[key];
			} 
			sanitized[key] = data[key];
		}
		
		return sanitized;
	},
}

module.exports = Serializer;