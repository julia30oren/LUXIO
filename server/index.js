const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./logger');
const moment = require("moment");
require('dotenv').config();
const AdminSchema = require('./routes/admin/admin-model');
const bcrypt = require('bcryptjs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// 
const path = require('path');
// const bodyParser = require('body-parser');
// 

// function to check if all parameters exist in .env
function ifEnvVarieblesExist(params) {
    const missingPart = params.filter(param => !process.env[param]);
    if (missingPart.length > 0) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${missingPart} --is missing in .env`);
        console.log(`${missingPart} --is missing in .env`)
    } else return;
}
ifEnvVarieblesExist([
"PORT", 
"HOST", 
"DATABASE", 
"DATABASE_NAME", 
"DB_PORT", 

"SECRET", 
"ADMIN_SECRET", 

"SMTPHOSTEMAILUSER", 
"SMTPHOSTEMAILPASSWORD", 
"DESIGNATEDSUPPORTEMAIL",

"mainAdmin",
"LuxioEmail" , 
"secretPASSWORD", 

"Twilio_AccountSid",
"Twilio_AuthToken"
]);

const db = mongoose.connection;
// ----------------------------CONNECTIN TO MongoDB----------------------------
mongoose.connect(`${process.env.DATABASE}://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log(`- We are connected to ${process.env.DATABASE}://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}`);
            logger.info(`${moment().format(`h:mm:ss a`)} - We are connected to ${process.env.DATABASE}://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE_NAME}.`);
    })
    .then(() => {
        console.log(`- Ready for work.`);
        logger.info(`${moment().format(`h:mm:ss a`)} - Ready for work.`);

        db.collection("admins").findOne({}, function (findErr, result) {
            if (findErr){
                console.log(findErr);
                throw findErr;
                } 
                else if (result===null){
                    db.createCollection("admins", function(err, res) {
                    if (err) throw err;
                    console.log('- Collection "admins" created!');
                    const salt = bcrypt.genSaltSync(10);
                    const main_passwordHash = bcrypt.hashSync(process.env.secretPASSWORD, salt);
                    const private_passwordHash = bcrypt.hashSync(process.env.SMTPHOSTEMAILPASSWORD, salt);
                    const mainAdmin = new AdminSchema({
                        email: process.env.LuxioEmail,
                        main_password: main_passwordHash, 
                        admin_name: process.env.mainAdmin.charAt(0).toUpperCase() + process.env.mainAdmin.slice(1),
                        admin_password: private_passwordHash,
                    });
                    mainAdmin.save();
                    console.log('- Main admin created.');
                    logger.info(`${moment().format(`h:mm:ss a`)} - Main admin created.`);
                    });
                } 
                else console.log('- Main admin exist.');
                logger.info(`${moment().format(`h:mm:ss a`)} - Main admin exist.`);
          });

    })
    .catch(err => console.log(err));

db.on('error', (error) => {
            console.log(error);
            logger.error(`${moment().format(`h:mm:ss a`)} - ${error}`);
});
db.once('open', () => {
            console.log(`- ${process.env.DATABASE} connected.`);
            logger.info(`${moment().format(`h:mm:ss a`)} - ${process.env.DATABASE} connected.`);
});

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
    next(); // Important
});
// 
app.use(express.json());

app.use('/user/registeration', require('./routes/user/registeration')); //check by postmane (exept upload-certificate)
app.use('/user', require('./routes/user/user')); //check  by postmane (exept cart and favorites)
app.use('/admin', require('./routes/admin/admin')); //check by postmane
app.use('/comments', require('./routes/comments/comments')); //check by postmane
app.use('/products', require('./routes/products/products')); //check by postmane
app.use('/order', require('./routes/orders/orders')); //check by postmane
app.use('/whatsapp', require('./routes/whatsapp/whatsapp'))


io.on('connection', (socket) => {
    console.log('a user connected');
  });

// 
app.set('io',io);

app.use(express.static(path.join(__dirname, '/dist/Luxio-app')));
// 

server.listen(process.env.PORT, "0.0.0.0", (err) => {
    if (err) {
        console.log(err);
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err}`);
    } else {
        console.log(`- Server is listening to port: ${process.env.PORT}`);
        logger.info(`${moment().format(`h:mm:ss a`)} - Server is listening to port: ${process.env.PORT}`);
    }
});