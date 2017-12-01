class RDocument {
	constructor(collectionName=null, obj={}, options = {}) {
		this.collectionName = collectionName || null;
		this.data = obj;
		this.validations = options.validations || {};
		this.errors = [];
	}

	prepareSave(collectionName) {
		let preparedData;
		return  sanitize(this.data);
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
			// Less confusing control flow possibly?
			if (data[key] === undefined && validations[key].isRequired === true) {
				return this.addError({prop: key, message: `{key} can't be blank`});
			} else if (data[key] === undefined) {
				return;
			}
			
			if (data[key].constructor.name !== validations[key].type.name) {
				this.addError({prop: key, message: 'Invalid type'});
			}
		});

		return this.errors.length === 0;
	}

	addError(error) {
		this.errors.push(error);
	}

	save() {
		const coll = db.collection(this.collectionName);
		// Consider using an index to force uniqueness 
  	return coll.update(this, this, { upsert: true });
	}
}

module.exports = RDocument;