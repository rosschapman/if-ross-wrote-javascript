class DTPDocument {
	constructor(collectionName, obj) {
		this.collectionName = collectionName;
		this.data = obj;
	}

	prepareSave(collectionName) {
		let preparedData;
		preparedData = sanitize(this.data);
		preparedData = validate(preparedData);

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

	validate(data) {
		debugger
	}

	save() {
		const coll = db.collection(this.collectionName);
		// Consider using an index to force uniqueness 
  	return coll.update(this, this, { upsert: true });
	}
}

module.exports = DTPDocument;