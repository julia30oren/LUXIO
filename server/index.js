const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config()
    // const logger = require("./utils/logger");
const app = express();

function ifEnvVarieblesExist(params) {
    const missingPart = params.filter(param => !process.env[param]);
    if (missingPart.length > 0) {
        // logger.error(`${missingPart} --is missing in .env`);
        console.log(`${missingPart} --is missing in .env`)
    } else return;
}
ifEnvVarieblesExist(["PORT", "HOST", "USER", "PASSWORD", "DATABASE", "DB_PORT", "SECRET", "ADMIN_SECRET"]);


app.use(cors());
app.use(bodyParser.json());

// app.use(require('./routes/get'))
// app.use(require('./routes/verification'))
// app.use(require('./routes/login'))
app.use(require('./routes/register'));
// app.use(require('./routes/vacations'))

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(`__error with PORT ${err}`);
        // logger.error(`__error with PORT: ${err}`);
    } else {
        console.log(`server is listening to port: ${process.env.PORT}`);
        // logger.info(`server is listening to port: ${process.env.PORT}`);
    }
})