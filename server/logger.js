const winston = require("winston");
const moment = require("moment");

const logger = winston.createLogger({

    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `logs/errors/${moment().format("DD-MM-YYYY")}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `logs/infos/${moment().format("DD-MM-YYYY")}/info.log`, level: 'info' })
    ]
});

module.exports = logger;