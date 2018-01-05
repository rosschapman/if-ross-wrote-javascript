const ActiveDoc = require('../data/active-doc');

const schema = {
	readId: {
		type: 'Reference', // TODO: might want special types kept in an object
		isRequired: true,
	},
	text: {
		type: String,
		isRequired: true
	},
}

const model = {
	collectionName: 'notes',
	schema: schema,
};

module.exports = Object.assign(ActiveDoc, model);