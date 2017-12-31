const ActiveDoc = require('../data/active-doc');

const schema = {
	read_id: {
		type: ObjectID,
		isRequired: true
	},
	text: {
		type: String,
		isRequired: true
	}
}

const model = {
	collectionName: 'notes',
	validations: schema,
};

module.exports = Object.assign(ActiveDoc, model);