const RDocument = require('./rdocument');

const readingMaterialSchema = {
	title: {
		type: String,
		isRequired: true
	},
	author: {
		type: {},
		isRequired: true,
	},
	startedAt: {
		type: Date,
		isRequired: true
	},
	finishedAt: {
		type: Date
	}
}

class ReadingMaterial extends RDocument {
	constructor(collectionName, obj) {
		super(collectionName, obj);
		this.validations = readingMaterialSchema;
	}
}

module.exports = ReadingMaterial;