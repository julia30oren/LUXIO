require('dotenv').config();
const express = require('express');
const router = express.Router();
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
const accountSid = process.env.Twilio_AccountSid;
const authToken = process.env.Twilio_AuthToken;
const client = require('twilio')(accountSid, authToken);

// const MessagingResponse = require('twilio').twiml.MessagingResponse;
let responseMessage;
// -----------------------------------------TO SEND a One-Way WhatsApp Message -------
router.post("/:lang", async(req, res) => {
    let message = req.body.say;
    let language = req.params.lang;
    sendWhatsapp(message);
    switch (language) {
        case 'en':
            responseMessage = `Message sent.`
            break;
        case 'ru':
            responseMessage = `Сообщение отправлено.`
            break;
        default:
            responseMessage = `הודעה נשלחה.`
            break;
    };
    res.json([{ status: true, message: responseMessage }]);
});


// router.post("/next", async(req, res) => {
//     // console.log('next', req.body.say);
//     const response = new MessagingResponse();
//     const message = response.message();
//     message.body(req.body.say);
//     response.redirect('https://demo.twilio.com/welcome/sms/');
//     console.log(response.toString());
// });


// ---------------------------------------SENDING A MESSAGE FROM WEB SITE ON WHATSAPP---------------
function sendWhatsapp(message) {
    client.messages
        .create({
            body: message,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+972524458442' //+972527490442 Alisa
        })
        .then(message => console.log(message))
        .done();
}

module.exports = router;