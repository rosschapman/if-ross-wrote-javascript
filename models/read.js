const ActiveDoc = require('../data/active-doc');

// Modeled this after mongoose schemas (http://mongoosejs.com/docs/guide.html)
const schema = {
	title: {
		type: String,
		isRequired: true
	},
	author: {
		type: Object,
		isRequired: true
	},
	startedAt: {
		type: Date,
		isRequired: true
	},
	finishedAt: {
		type: Date
	}
}

const model = {
	collectionName: 'reads',
	validations: schema,
	saveSuccessMessage: `You just finished reading ${this.title}? That's so awesome!`,
};

module.exports = Object.assign(ActiveDoc, model);