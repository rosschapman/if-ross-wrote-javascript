const twilio = require('twilio');
const RDocument = require('./rdocument');

const accountSid = 'ACa426fa8a0867fa95abef9025bcbe0583';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

// Modeled this after mongoose schemas
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

class ReadingMaterial extends RDocument {
	constructor(collectionName, obj) {
		super(collectionName, obj);
		this.validations = schema;
	}

	get title() {
		return this.data.title;
	}

	sendSmsCongrats() {
		console.log('Sending twilio message')
		twilioClient.messages.create({
		    body: `You just finished reading ${this.title}? That's so awesome!`,
		    to: '+14019350598',  // Text this number
		    from: '+14159695342 ' // From a valid Twilio number
		})
		.then((message) => { 
			console.log('SMS sentmessage.sid')
		});
	}
}

module.exports = ReadingMaterial;