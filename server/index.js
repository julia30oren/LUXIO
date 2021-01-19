const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./logger');
const moment = require("moment");
require('dotenv').config();

const app = express();

// function to check if all parameters exist in .env
function ifEnvVarieblesExist(params) {
    const missingPart = params.filter(param => !process.env[param]);
    if (missingPart.length > 0) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${missingPart} --is missing in .env`);
        console.log(`${missingPart} --is missing in .env`)
    } else return;
}
ifEnvVarieblesExist(["PORT", "HOST", "USER", "PASSWORD", "mongo_DATABASE", "DB_PORT", "SECRET", "ADMIN_SECRET" , "SMTPHOSTEMAILUSER", "SMTPHOSTEMAILPASSWORD", "DESIGNATEDSUPPORTEMAIL" ,"LuxioEmail" , "secretPASSWORD"]);
// -------------------


// ----------------------------CONNECTIN TO MongoDB----------------------------
mongoose.connect(process.env.mongo_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log(`- We are connected to ${process.env.mongo_DATABASE}`);
            logger.info(`${moment().format(`h:mm:ss a`)} - We are connected to ${process.env.mongo_DATABASE}.`);
    })
    .then(() => {
        console.log(`- Ready for work.`);
        logger.info(`${moment().format(`h:mm:ss a`)} - Ready for work.`);
    })
    .catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', (error) => {
            console.log(error);
            logger.error(`${moment().format(`h:mm:ss a`)} - ${error}`);
})
db.once('open', () => {
            console.log(`- MongoDB connected.`);
            logger.info(`${moment().format(`h:mm:ss a`)} - MongoDB connected.`);
})

app.use(cors({ origin: 'http://localhost:4000' }));

app.use(express.json());

app.use('/user/registeration', require('./routes/user/registeration')); //check by postmane (exept upload-certificate)
app.use('/user', require('./routes/user/user')); //check  by postmane (exept cart and favorites)
app.use('/admin', require('./routes/admin/admin')); //check by postmane
app.use('/comments', require('./routes/comments/comments')); //check by postmane
app.use('/products', require('./routes/products/products')); //check by postmane
app.use('/order', require('./routes/orders/orders')); //check by postmane
app.use('/whatsapp', require('./routes/whatsapp/whatsapp'))

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err}`);
    } else {
        console.log(`- Server is listening to port: ${process.env.PORT}`);
        logger.info(`${moment().format(`h:mm:ss a`)} - Server is listening to port: ${process.env.PORT}`);
    }
});