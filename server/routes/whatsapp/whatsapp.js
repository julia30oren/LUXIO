require('dotenv').config();
const express = require('express');
const router = express.Router();
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
const accountSid = process.env.Twilio_AccountSid;
const authToken = process.env.Twilio_AuthToken;
const client = require('twilio')(accountSid, authToken);

const MessagingResponse = require('twilio').twiml.MessagingResponse;


// const wbm = require('wbm');



router.post("/", async(req, res) => {
    sendWhatsapp(req.body.say);
    res.json([{ status: true, message: `Whatsapp message sent.` }]);
    // console.log('go')
    // -----------------
    // wbm.start().then(async() => {
    //     const phones = ['972524458442'];
    //     const message = 'Good Morning.';
    //     await wbm.send(phones, message);
    //     await wbm.end();
    // }).catch(err => console.log(err));
});

router.post("/next", async(req, res) => {
    console.log('next', req.body.say);

    const response = new MessagingResponse();
    const message = response.message();
    message.body(req.body.say);
    response.redirect('https://demo.twilio.com/welcome/sms/');

    console.log(response.toString());
});
// ---------------------------------------SENDING A MESSAGE FROM WEB SITE ON WHATSAPP---------------
function sendWhatsapp(to_say) {
    client.messages
        .create({
            body: to_say,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+972524458442'
        })
        .then(message => console.log(message))
        .done();
}

module.exports = router;