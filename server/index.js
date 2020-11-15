// need to be done ------------- soon-----------------------
// const logger = require("./utils/logger");
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
// const passwordValidation = require('./validSchema');
// router.use(passwordValidation);
// create new email for Luxio
// const bodyParser = require("body-parser");


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// function to check if all parameters exist in .env
function ifEnvVarieblesExist(params) {
    const missingPart = params.filter(param => !process.env[param]);
    if (missingPart.length > 0) {
        // logger.error(``);
        console.log(`${missingPart} --is missing in .env`)
    } else return;
}
ifEnvVarieblesExist(["PORT", "HOST", "USER", "PASSWORD", "mongo_DATABASE"]);
// -------------------


// ----------------------------CONNECTIN TO MongoDB----------------------------
mongoose.connect(process.env.mongo_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log(`- We are connected to ${process.env.mongo_DATABASE}`)
    })
    .then(() => { console.log(`- Ready for work.`) })
    .catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error);
    // logger.error(``);
})
db.once('open', () => {
    console.log(`- MongoDB connected.`);
    // logger.info(``);
})

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

app.use('/user/registeration', require('./routes/user/registeration')); //check by postmane (exept upload-certificate)
app.use('/user', require('./routes/user/user')); //check  by postmane (exept cart and favorites)
app.use('/admin', require('./routes/admin/admin')); //check by postmane
app.use('/comments', require('./routes/comments/comments')); //check by postmane
app.use('/products', require('./routes/products/products')); //check by postmane
app.use('/whatsapp', require('./routes/whatsapp/whatsapp'))

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
        // logger.error(``);
    } else {
        console.log(`- Server is listening to port: ${process.env.PORT}`);
        // logger.info(``);
    }
});