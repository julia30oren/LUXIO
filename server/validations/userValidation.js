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
    second_name: Joi.any(),
    phoneN: Joi.any(),
    state: Joi.string(),
    email: Joi.string().min(8).max(40).message('EMAIL is not valid'),
    password: Joi.any(),
    confirmPassword: Joi.any(),
    conditionsСonfirmation: Joi.any(),
    category: Joi.string(),
    files: Joi.any(),
    agreement: Joi.any(),
    certificate_link: Joi.any(),
    cart: Joi.any(),
    favorites: Joi.any(),
    set_id: Joi.string(),
    newSet: Joi.any(),
    business: Joi.any(),
    photo_link: Joi.any(),
    old_pass: Joi.any(),
    new_pass: Joi.string().min(6),
    city: Joi.any(),
    street: Joi.any(),
    home: Joi.any(),
    apartment: Joi.any(),
    zip: Joi.any(),
    tempPass: Joi.any(),
    newPass: Joi.string().min(6),
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