const Joi = require('joi');
const moment = require("moment");
const logger = require('../logger');

const validSchema = Joi.object({
    // MAIN
    lang: Joi.any().valid('iv', 'en', 'ru'), // languege
    files: Joi.any(), //?
    status: Joi.any().valid(true, false), //?

    // FOR USER    
    id: Joi.string().min(10),
    _id: Joi.string().min(10),
    first_name: Joi.string().min(2).max(30),
    second_name: Joi.string().min(2).max(30),
    phoneN: Joi.string().min(8).max(20).message('PHONE NUMBER is not valid. It must contain at least 8 letters numbers (may contain "-" and/or "()").'),
    state: Joi.string(),
    email: Joi.string().min(8).max(30).message('EMAIL is not valid'),
    password: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),
    category: Joi.string(),
    certificate_link: Joi.any(),
    cart: Joi.any(),
    favorites: Joi.any(),
    business: Joi.any(),
    photo_link: Joi.any(),
    old_pass: Joi.any(),
    new_pass: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),
    city: Joi.string().min(3),
    street: Joi.string().min(3),
    home: Joi.string().max(6),
    apartment: Joi.string().max(6),
    zip: Joi.number().min(5).max(15),
    tempPass: Joi.any(),
    agreement: Joi.any(),
    newPass: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),
})

function userValidation(req, res, next) {

    const { error } = validSchema.validate(req.body);

    if (error) {
        console.log(error);
        logger.error(`${moment().format(`h:mm:ss a`)} - Wrong data format : ${error.details[0].message}`);
            return res.json([{ status: false, message: `Wrong data format : ${error.details[0].message}` }]);
    }
    next();
}

module.exports = userValidation;