class RDocument {
	constructor(collectionName, obj, options) {
		this.collectionName = collectionName;
		this.data = obj;
		this.errors = [];
	}

	prepareSave(collectionName) {
		let preparedData;
		preparedData = sanitize(this.data);
		if (isValid(preparedData)) {
			return preparedData;
		} else {
			console.log(this.errors);
		}
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

	isValid(data) {
		Object.keys(data).forEach((key)=> {
			if (typeof key !== this.validations[key].type) {
				this.errors.push({prop: key, message: 'Invalid type'});
			}

			if (this.validations[key].isRequired === true && this.validations[key] === undefined ) {
				this.errors.push({prop: key, message: `{key} can't be blank`});
			}
		});

		return this.errors.length === 0;
	}

	save() {
		const coll = db.collection(this.collectionName);
		// Consider using an index to force uniqueness 
  	return coll.update(this, this, { upsert: true });
	}
}

module.exports = DTPDocument;