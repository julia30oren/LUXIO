const Joi = require('joi');
const moment = require("moment");
const logger = require('../logger');

const validSchema = Joi.object({
    // MAIN
    lang: Joi.any().valid('iv', 'en', 'ru'), // languege

    // FOR ADMIN     admin_name, admin_password,id,email, main_password
    id: Joi.string().min(10),
    admin_name: Joi.string().alphanum().min(3).max(30), // personnel admin name
    admin_password: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'), // personnel admin password
    main_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).message('EMAIL is not valid').min(8).max(30),
    main_password: Joi.string().min(14).message('PASSWORD is not valid. It must contain at least 14 letters and/or numbers').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),
})

function adminValidation(req, res, next) {

    const { error } = validSchema.validate(req.body);

    if (error) {
        console.log(error);
        logger.error(`${moment().format(`h:mm:ss a`)} - Wrong data format : ${error.details[0].message}`);
            return res.json([{ status: false, message: `Wrong data format : ${error.details[0].message}` }]);
    }
    next();
}

module.exports = adminValidation;