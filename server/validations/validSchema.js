const Joi = require('joi');
const moment = require("moment");
const logger = require('../logger');

const validSchema = Joi.object({
    // MAIN
    lang: Joi.any().valid('iv', 'en', 'ru'),
    files: Joi.any(),

    // FOR ADMIN     admin_name, admin_password,id,email, main_password
    id: Joi.string().min(10),
    admin_name: Joi.string().alphanum().min(3).max(30).required(), // personnel admin name
    admin_password: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'), // personnel admin password
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).message('EMAIL is not valid'),
    main_password: Joi.string().min(14).message('PASSWORD is not valid. It must contain at least 14 letters and/or numbers').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),

    // FOR USER   
    first_name: Joi.string().alphanum().min(2).max(30).required(),
    second_name: Joi.string().alphanum(),
    phoneN: Joi.string().min(8).max(20).pattern(new RegExp('^(- ())[0-9]{3,30}$')).message('PHONE NUMBER is not valid. It must contain at least 8 letters numbers (may contain "-" and/or "()").'),
    state: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    password: Joi.string().min(6).message('PASSWORD is to short. It must contain at least 6 letters and/or numbers.').pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('PASSWORD is not valid.'),
    category: Joi.string(),
    certificate_link: Joi.any(),
    cart: Joi.any(),
    favorites: Joi.any(),
    business: Joi.string()


    // validations fo USERS & ADMIN :
    // users_email: Joi.string().regex(/^(?=.*[@])[a-zA-Z\0-9\admin\@.]+$/i, 'EMAIL is not valid. Email must containe only letters and "@", "."').min(10).max(30),
    // users_first_name: Joi.string().regex(/^[a-zA-Z]+$/i, 'USERS FIRST NAME is not valid. Name must contain only letters and not less than 2').min(2),
    // users_last_name: Joi.string().regex(/^[a-zA-Z]+$/i, 'USERS LAST NAME is not valid. Name must contain only letters and not less than 2').min(2),
    // password: Joi.string().regex(/^[a-zA-Z\0-9]+$/i, 'PASSWORD is not valid. Password must contain from 4 to 10 letters or numbers').min(4).max(10),
    // newpass: Joi.string().regex(/^[a-zA-Z\0-9]+$/i, 'PASSWORD is not valid. Password must contain from 4 to 10 letters or numbers').min(4).max(10),
    // confPass: Joi.string().regex(/^[a-zA-Z\0-9]+$/i, 'PASSWORD is not valid. Password must contain from 4 to 10 letters or numbers').min(4).max(10),
    // name: Joi.string().min(1),

    // validations for custom data :
    // id: Joi.number().min(1),
    // vacation_id: Joi.number().min(1),
    // vacations_country: Joi.string().min(2).max(45),
    // vacations_prices: Joi.string().min(1).max(6),
    // vacations_description: Joi.string().min(10).max(500),
    // vacations_start: Joi.string().min(8).max(10),
    // vacations_end: Joi.string().min(8).max(10),
    // vacations_IMG: Joi.string().regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, 'URL is not valid').min(10),
})

function dataValidation(req, res, next) {
    console.log(req.body)
    const { error } = validSchema.validate(req.body);
    if (error) {
        console.log(error);
        const error_message = error.details[0].context.name;
        logger.error(`${moment().format(`h:mm:ss a`)} - Wrong data format : ${error.details[0].message}`);

        if (error_message) {
            console.log(error.details[0].context)
            return res.json([{ status: false, message: `Wrong data format : ${error.details[0].message}` }]);
        } else {
            return res.json([{ status: false, message: `Wrong data format : ${error.details[0].message}` }]);
        }
    }
    next();
}

module.exports = dataValidation;