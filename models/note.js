const ActiveDoc = require('../data/active-doc');

const schema = {
	readId: {
		type: 'Reference',
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

module.exports = Object.assign(Object.create(ActiveDoc), model);

// 	TODO: might want special types ie "Reference" kept in an object
//	Types = {
//		Reference: {}
// 	}