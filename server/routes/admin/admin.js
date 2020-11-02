const express = require('express');
const router = express.Router();
const AdminSchema = require('.//admin-model');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const nodemailer = require("nodemailer");
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
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

// ---------------------------------------------------GET ALL ADMINS-----------------------------
router.get("/", async(req, res, next) => {
    try {
        const alladmins = await AdminSchema.find();
        res.json([{ status: true, alladmins }]);
        // logger.info(``);
    } catch (err) {
        res.json([{ status: false, massage: err.message }]);
        // logger.error(``);
    }
});


// ----------------------------------------------------CREATE AN ADMIN------------------------------
router.post("/:lang/create", async(req, res) => {
    // to create new admin Im using :
    const language = req.params.lang;
    const { admin_name, admin_password } = req.body;
    // email - official email of a company
    // main_password - one password for everyone
    // admin_name - personnel admin name
    // admin_password - personnel admin password
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
            }
            res.json([{ status: true, massage: responseMessage }]);
            emailToLuxio(newAdmin_toSave.admin_name, true, language);
            // logger.info(``);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `We have an error. Admin wasn't created`
                    break;
                case 'ru':
                    responseMessage = `Новый админ успешно создан.`
                    break;
                default:
                    responseMessage = `מנהל מערכת חדש נוצר בהצלחה.`
                    break;
            }
            res.json([{ status: false, massage: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, massage: err.message }]);
        // logger.error(``);
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
            }
            emailToLuxio(admin.admin_name, false, language);
            return res.json([{ status: true, massage: responseMessage }]);
            // logger.info(``);
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
            }
            return res.json([{ status: false, massage: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, massage: err.message }]);
        // logger.error(``);
    }
});


// -------------------------------------------------ADMIN LOG-IN-------------------------
router.post('/:lang/login', async(req, res) => {
    const language = req.params.lang;
    const { email, main_password, admin_name, admin_password } = req.body;
    // check for main email match--------------
    if (email === process.env.LuxioEmail) {
        const adminExist = await AdminSchema.findOne({ "admin_name": admin_name.charAt(0).toUpperCase() + admin_name.slice(1) });
        if (adminExist) {
            // cheking main password--------------------
            // and private password--------------------
            const hush = adminExist.admin_password;
            const cryptoPassChek = bcrypt.compareSync(admin_password, hush);
            if (cryptoPassChek && main_password === process.env.secretPASSWORD) {
                // -----------------------------------------------------------If SUCCESS-------------------
                const adminToken = JWT.sign({ email }, process.env.ADMIN_SECRET, { expiresIn: '6h' });
                // ---------------------CHOOSING LANGUAGE for response-------------------------
                switch (language) {
                    case 'en':
                        responseMessage = `Admin <<${admin_name}>> loged in.`
                        break;
                    case 'ru':
                        responseMessage = `Админ <<${admin_name}>> авторизовался.`
                        break;
                    default:
                        responseMessage = `מנהל מערכת <<${admin_name}>> התחבר.`
                        break;
                }
                res.json([{ status: true, message: responseMessage, token: adminToken, admin: adminExist }]);
                // logger.info(``);
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
                }
                res.json([{ status: false, massage: responseMessage }]);
                // logger.error(``);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `Admin <<${admin_name}>> don't exist.`
                    break;
                case 'ru':
                    responseMessage = `Администратор не авторизовался. Пожалуйста, проверьте << Основной пароль >> и ваш << Персональный пароль >>.`
                    break;
                default:
                    responseMessage = `מנהל המערכת לא התחבר. אנא בדוק << סיסמה ראשית >> ואת << סיסמה אישית >> שלך.`
                    break;
            }
            res.json([{ status: false, massage: responseMessage }]);
            // logger.error(``);
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
        }
        res.json([{ status: false, massage: responseMessage }]);
        // logger.error(``);
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