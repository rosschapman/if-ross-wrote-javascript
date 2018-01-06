const ActiveDoc = require('../data/active-doc');

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
	},
	notes: [],
}

const model = {
	collectionName: 'reads',
	schema: schema,
	saveSuccessMessage: `You just finished reading ${this.title}? That's so awesome!`, 
};

module.exports = Object.assign({}, ActiveDoc, model);
