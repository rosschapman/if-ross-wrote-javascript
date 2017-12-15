const twilio = require('twilio');
const BaseModel = require('./models/base');

// Settings
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_FROM_PHONE;
const toPhone = process.env.TWILIO_TO_PHONE;
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

const model = (data) =>  ({
	collectionName: 'reading-materials',
	validations: schema,
	data: data,
	sendSmsCongrats() {
		twilioClient.messages.create({
		    body: `You just finished reading ${this.title}? That's so awesome!`,
		    to: toPhone,
		    from: fromPhone
		})
		.then((message) => { 
			console.log('SMS sent:', message.sid)
		});
	}
});

const thisModel = Object.assign(BaseModel, model());

module.exports = thisModel;