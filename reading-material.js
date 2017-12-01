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

class ReadingMaterial extends DTPDocument {
	contstructor() {
		this.validations = readingMaterialSchema;
	}
}

module.exports = ReadingMaterial;