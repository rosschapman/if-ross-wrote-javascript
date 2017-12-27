const fs = require('fs');
const path = require('path');
const db = require('./db');

let files = {};
fs.readdirSync(path.join(__dirname, '../', 'models')).forEach((file) => {
	if (/\.js$/.test(file)) {
		files[path.basename(file, '.js')] = require(`../models/${file}`);
  }
});

let ActiveRecord = {
	collectionName: null,
	get modelName() {
		return this.collectionName.slice(0, -1);
	},
	errors: [],
	prepareSave(collectionName) {
		return sanitize(this.data);
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
	isValid() {
		const data = this.data;
		const validations = this.validations;

		Object.keys(validations).forEach((key)=> {
			if (!validations[key].isRequired) {
				return;
			}

			const dataConstructorName = data[key].constructor.name;
			// Less confusing control flow possiblyyyy, oh man starts to get a little // rambuncious when I start gating the different types below
			if (data[key] === undefined && validations[key].isRequired === true) {
				return this.addError({prop: key, message: `{key} can't be blank`});
			} else if (data[key] === undefined) {
				return;
			}
			
			if (
				dataConstructorName === 'String' && 
				dataConstructorName !== validations[key].type.name
			) {
				this.addError({prop: key, message: 'Invalid type, must be string'});
			}

			if (
				dataConstructorName === 'Object' && 
				dataConstructorName !== validations[key].constructor.name
			) {
				this.addError({prop: key, message: 'Invalid type, must be object'});
			}

			if (
				dataConstructorName === 'Date' && 
				dataConstructorName !== validations[key].type.name
			) {
				this.addError({prop: key, message: 'Invalid type, must be a date'});
			}
		});

		return this.errors.length === 0;
	},
	addError(error) {
		this.errors.push(error);
	},
	create(data) {
		this.data = this._serializeData(data)
		return this;
	},
	update() {
		const coll = db.getDb().collection(this.collectionName);
		const docTitle = this.data.title;
		const doctFinishedAtDate = this.data.finishedAt;
		
		// Consider using an index to force uniqueness
    return coll.update({ 
			title: docTitle }, 
			{
				$set: {
					'finishedAt': doctFinishedAtDate
				}
			}
		);
	},
	save() {
		const coll = db.getDb().collection(this.collectionName);
		return coll.update({ title: this.data.title }, this.data, { upsert: true });
  },
  destroy() {
    const coll = db.getDb().collection(this.collectionName);
    return coll.deleteOne(this.data);
	},
  findOne(data) {
    return db.getDb().collection(this.collectionName).findOne(data)
      .then((result) => {
        if (result === null) {
          return {};
        } else {
					this.data = this._serializeData(data);
          return this;
        }
      });
  },
  // TODO: consider moving private methods to utility classes
  _serializeData(object) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
				// Converts date strings to date objects
        if (/At$/.test(key)) {
          object[key] = new Date(object[key]);
        }
      }
    }
    return object;
  }
}

module.exports = ActiveRecord