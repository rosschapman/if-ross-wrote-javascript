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

const obj = Object.create(ActiveDoc);
module.exports = Object.assign(obj, model);

// 	TODO: might want special types ie "Reference" kept in an object
//	Types = {
//		Reference: {}
// 	}