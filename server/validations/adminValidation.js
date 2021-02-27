const Joi = require('joi');
const moment = require("moment");
const logger = require('../logger');

const validSchema = Joi.object({
    // MAIN
    lang: Joi.any().valid('iv', 'en', 'ru'), // languege

    // FOR ADMIN     admin_name, admin_password,id,email, main_password
    id: Joi.string().min(10),
    admin_name: Joi.string().alphanum().min(3).max(30), // personnel admin name
    admin_password: Joi.string(), // personnel admin password
    email: Joi.string(),
    main_email: Joi.string(),
    main_password: Joi.string(),
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