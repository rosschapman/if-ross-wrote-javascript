const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_FROM_PHONE;
const toPhone = process.env.TWILIO_TO_PHONE;
const twilioClient = new twilio(accountSid, authToken);

const Notifications = {
  sendSMS(messageBody) {
    twilioClient.messages.create({
        body: messageBody,
        to: toPhone,
        from: fromPhone
    })
    .then((message) => { 
      console.log('SMS sent:', message.sid)
    });
  }
}

module.exports = Notifications;