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

const model = (data) =>  ({
	collectionName: 'reads',
	get validations() {
		return schema;
	},
	get data() {
		return data;
	},
	get saveSuccessMessage() {
		return `You just finished reading ${this.title}? That's so awesome!`;
	},
});

module.exports = model;