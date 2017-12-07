const db = require('./lib/db');

class RDocument {
	constructor(collectionName=null, obj={}, options = {}) {
		this.collectionName = collectionName || null;
		this.data = obj;
		this.validations = options.validations || {};
		this.errors = [];
	}

	prepareSave(collectionName) {
		return sanitize(this.data);
	}

	sanitize(data) {
		let sanitized = {};
		for (const key in data) {
			// Kill the $ mongo exploit
			// More here: https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
			if (/^\$/.test(key)) {
				console.log(`Leslie NOPE, this key:${key} is dangerous`)
				delete data[key]
			} 
			sanitized[key] = data[key];
		}

		return sanitized;
	}

	isValid() {
		const data = this.data;
		const validations = this.validations;

		Object.keys(validations).forEach((key)=> {
			// Less confusing control flow possiblyyyy, oh man starts to get a little rambuncious when I
			// start gating the different types below
			if (data[key] === undefined && validations[key].isRequired === true) {
				return this.addError({prop: key, message: `{key} can't be blank`});
			} else if (data[key] === undefined) {
				return;
			}

			if (
				data[key].constructor.name === 'String' && 
				data[key].constructor.name !== validations[key].type.name
			) {
				this.addError({prop: key, message: 'Invalid type, must be string'});
			}

			if (
				data[key].constructor.name === 'Object' && 
				data[key].constructor.name !== validations[key].constructor.name
			) {
				this.addError({prop: key, message: 'Invalid type, must be object'});
			}
		});

		return this.errors.length === 0;
	}

	addError(error) {
		this.errors.push(error);
	}

	save(successCallback, errorCallback) {
		const that = this;
		const coll = db.getDb().collection(that.collectionName);
		// Consider using an index to force uniqueness
  		coll.update(
			that, 
			that, 
			{ upsert: true }
		).then((result) => {
			// Hmmm: not sure why but result.hasWriteError() isn't working
			if (result.writeErrors) { 
				console.log(err); 
				res.write(err);
				res.end();
			} else {
				successCallback(result);
				res.writeHead(201);
				res.write(`Success yo! ${result}`)
				res.end();
			}
  		});
	}
}

module.exports = RDocument;