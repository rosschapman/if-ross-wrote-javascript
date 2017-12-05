const twilio = require('twilio');
const RDocument = require('./rdocument');

const accountSid = 'ACa426fa8a0867fa95abef9025bcbe0583';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

const readingMaterialSchema = {
	title: {
		type: String,
		isRequired: true
	},
	author: {
		type: {},
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
		this.validations = readingMaterialSchema;
	}

	sendMeTextWhenIFinishReading() {
		twilioClient.messages.create({
		    body: 'Hello from Node',
		    to: '+4019350598',  // Text this number
		    from: '+14159695342 ' // From a valid Twilio number
		})
		.then((message) => console.log(message.sid));
	}
}

module.exports = ReadingMaterial;