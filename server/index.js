const express = require('express');
// const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv').config();
// const logger = require("./utils/logger");
const app = express();

function ifEnvVarieblesExist(params) {
    const missingPart = params.filter(param => !process.env[param]);
    if (missingPart.length > 0) {
        // logger.error(`${missingPart} --is missing in .env`);
        console.log(`${missingPart} --is missing in .env`)
    } else return;
}
ifEnvVarieblesExist(["PORT", "HOST", "USER", "PASSWORD", "mongo_DATABASE", "mySgl_DATABASE"]);


mongoose.connect(process.env.mongo_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log(`DB conected to ${process.env.mongo_DATABASE}`)
    })
    .then(() => { console.log('all good') })
    .catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', (error) => {
    console.log('!!!!!! ', error);
    // logger.error(`${now} - ${error}`);
})
db.once('open', () => {
    console.log('Connected to DB');
    // logger.info(`${now} - Connected to MongoDB`);
})

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

app.use('/register', require('./routes/register/register'));
app.use('/shop', require('./routes/products/products'));


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(`__error with PORT ${err}`);
        // logger.error(`__error with PORT: ${err}`);
    } else {
        console.log(`server is listening to port: ${process.env.PORT}`);
        // logger.info(`server is listening to port: ${process.env.PORT}`);
    }
})