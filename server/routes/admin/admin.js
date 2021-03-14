const express = require('express');
const router = express.Router();
const AdminSchema = require('.//admin-model');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const logger = require('../../logger');
const moment = require("moment");
let responseMessage;
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTPHOSTEMAILUSER,
        pass: process.env.SMTPHOSTEMAILPASSWORD,
    }
});
const adminValidation = require('../../validations/adminValidation');
router.use(adminValidation);

// ---------------------------------------------------admin Check-----------------------------
router.get("/check/:token", async(req, res, next) => {
    const token = req.params.token;
    JWT.verify(token, process.env.ADMIN_SECRET, function(err, decoded) {
        if (err) {
            return res.json([{ status: false }]);
        } else {
            return res.json([{ status: true }]);
        }
    });
});

// ---------------------------------------------------GET ALL ADMINS-----------------------------
router.get("/", async(req, res, next) => {
            try {
                const alladmins = await AdminSchema.find();
                return res.json([{ status: true, alladmins }]);
            } catch (err) {
                logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
                return res.json([{ status: false, message: err.message }]);
    }
});


// ----------------------------------------------------CREATE AN ADMIN------------------------------
router.post("/:lang/create", async(req, res) => {
    // to create new admin Im using :
    const language = req.params.lang;
    const { admin_name, admin_password, main_password, email } = req.body;
    // email - official email of a company
    // main_password - one password for everyone 
    // admin_name - personnel admin name
    // admin_password - personnel admin password
    if(main_password===process.env.secretPASSWORD && email===process.env.LuxioEmail){
    const salt = bcrypt.genSaltSync(10);
    const main_passwordHash = bcrypt.hashSync(process.env.secretPASSWORD, salt);
    const private_passwordHash = bcrypt.hashSync(admin_password, salt);
    // -------------------------------------------all passwords were cripted------------------
    const newAdmin = new AdminSchema({
        email: process.env.LuxioEmail,
        main_password: main_passwordHash,
        admin_name: admin_name.charAt(0).toUpperCase() + admin_name.slice(1),
        admin_password: private_passwordHash,
    });
    // -----------------------------------------SAVING-------------------
    try {
        const newAdmin_toSave = await newAdmin.save();
        // ---------------------------------If SUCCESS - send message to Luxio----------------------
        if (newAdmin_toSave._id) {
            // ---------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `New Admin was created successfully.`
                    break;
                case 'ru':
                    responseMessage = `Новый админ успешно создан.`
                    break;
                default:
                    responseMessage = `מנהל מערכת חדש נוצר בהצלחה.`
                    break;
            };
            emailToLuxio(newAdmin_toSave.admin_name, true, language);
            logger.info(`${moment().format(`h:mm:ss a`)} - New Admin was created <<${newAdmin_toSave.admin_name}>> `);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `An error has occurred. Admin was not added.`
                    break;
                case 'ru':
                    responseMessage = `Произошла ошибка. Админ не был добавлен.`
                    break;
                default:
                    responseMessage = `אירעה שגיאה. מנהל המערכת לא התווסף.`
                    break;
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err}`);
        return res.json([{ status: false, message: err.message }]);
    }
    } else {
        switch (language) {
            case 'en':
                responseMessage = `An error has occurred. Email and master password do not match.`
                break;
            case 'ru':
                responseMessage = `Произошла ошибка. Емейл и главный пароль не совпадают.`
                break;
            default:
                responseMessage = `אירעה שגיאה. הדוא"ל והסיסמה הראשית אינם תואמים.`
                break;
        };
        logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
        return res.json([{ status: false, message: responseMessage }]);
    }

});


// -------------------------------------------------DELETE ADMIN BY ID-----------------------------
router.get('/:lang/remove/:id', async(req, res) => {
    const adminID = req.params.id;
    const language = req.params.lang;
    try {
        const admin = await AdminSchema.findOne({ "_id": adminID });
        let admin_toDelete = await AdminSchema.findByIdAndRemove({ "_id": adminID });
        if (admin_toDelete !== null) {
            // ---------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `Admin was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Админ удален.`
                    break;
                default:
                    responseMessage = `מנהל המערכת נמחק.`
                    break;
            };
            emailToLuxio(admin.admin_name, false, language);
            logger.info(`${moment().format(`h:mm:ss a`)} - <<${admin.admin_name}>> ${responseMessage}`);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Admin wasn't found.`
                    break;
                case 'ru':
                    responseMessage = `Админ не найден.`
                    break;
                default:
                    responseMessage = `מנהל המערכת לא נמצא.`
                    break;
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err}`);
        return res.json([{ status: false, message: err.message }]);
    }
});


// -------------------------------------------------ADMIN LOG-IN-------------------------
router.post('/:lang/login', async(req, res) => {
    const language = req.params.lang;
    const { main_email, main_password, admin_name, admin_password } = req.body;

    let adminName = admin_name.charAt(0).toUpperCase() + admin_name.slice(1)
        // check for main email match--------------
    if (main_email === process.env.LuxioEmail) {
        const adminExist = await AdminSchema.findOne({ "admin_name": adminName, "email": main_email });
        if (adminExist) {
            // cheking main password--------------------
            const hush1 = adminExist.main_password;
            const cryptoPassChek1 = bcrypt.compareSync(main_password, hush1);
            // and private password--------------------
            const hush2 = adminExist.admin_password;
            const cryptoPassChek2 = bcrypt.compareSync(admin_password, hush2);

            if (cryptoPassChek1 && cryptoPassChek2 && main_password === process.env.secretPASSWORD) {
                // -----------------------------------------------------------If SUCCESS-------------------
                const adminToken = JWT.sign({ main_email }, process.env.ADMIN_SECRET, { expiresIn: '6h' });
                // ---------------------CHOOSING LANGUAGE for response-------------------------
                switch (language) {
                    case 'en':
                        responseMessage = `Admin <<${adminName}>> loged in.`
                        break;
                    case 'ru':
                        responseMessage = `Админ <<${adminName}>> авторизовался.`
                        break;
                    default:
                        responseMessage = `מנהל מערכת <<${adminName}>> התחבר.`
                        break;
                };
                logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                return res.json([{ status: true, message: responseMessage, token: adminToken, admin: adminName }]);
            }
            // -------------------------ERRORS--------------
            else {
                switch (language) {
                    case 'en':
                        responseMessage = `Admin wasn't loged in. Please, check <<Main password>> and your <<Personal password>>.`
                        break;
                    case 'ru':
                        responseMessage = `Администратор не авторизовался. Пожалуйста, проверьте << Основной пароль >> и ваш << Персональный пароль >>.`
                        break;
                    default:
                        responseMessage = `מנהל המערכת לא התחבר. אנא בדוק << סיסמה ראשית >> ואת << סיסמה אישית >> שלך.`
                        break;
                };
                logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                return res.json([{ status: false, message: responseMessage }]);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `Admin <<${admin_name}>> don't exist.`
                    break;
                case 'ru':
                    responseMessage = `Админа <<${admin_name}>> не существует.`
                    break;
                default:
                    responseMessage = `מנהל  <<${admin_name}>> לא קיים.`
                    break;
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } else {
        switch (language) {
            case 'en':
                responseMessage = `<<Main email>> don't match.`
                break;
            case 'ru':
                responseMessage = `<<Основной адрес электронной почты>> не соответствует.`
                break;
            default:
                responseMessage = `<< דוא"ל ראשי >> אינם תואמים.`
                break;
        };
        logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
        return res.json([{ status: false, message: responseMessage }]);
    }
});


// -------------------------------------------------------MESSAGES----------------------------------------------------
// -----------------------------------------Message to Luxio (admin 'created' or 'deleted')----------------------------------------------------
function emailToLuxio(admin, moovment, language) {
    // creating a message to Ann
    let emailMeassage;
    if (moovment) {
        // ---------------------CHOOSING LANGUAGE for response-------------------------
        switch (language) {
            case 'en':
                emailMeassage = `New admin - ${admin} - was created successfully.`
                break;
            case 'ru':
                emailMeassage = `Новый администратор - ${admin} - успешно создан.`
                break;
            default:
                emailMeassage = `מנהל חדש - ${admin} - נוצר בהצלחה.`
                break;
        }
    } else {
        // ---------------------CHOOSING LANGUAGE for response-------------------------
        switch (language) {
            case 'en':
                emailMeassage = `Admin - ${admin} - was deleted.`
                break;
            case 'ru':
                emailMeassage = `מנהל המערכת - ${admin} - נמחק.`
                break;
            default:
                emailMeassage = `Админ - ${admin} - удален.`
                break;
        }
    }
    // --------------------------------------------------------------SENDING-------------------------------------
    const main = async() => {
        // -------------------------------send mail with defined transport object-------------
        // short information message for Ann :
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: `❄️ Admin News ❄️`, // Subject line
            html: `<h3>${emailMeassage}</h3>`
        });
    }
    main().catch(console.error);
};


module.exports = router;