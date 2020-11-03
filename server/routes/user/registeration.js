const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserSchema = require('./user-model');
const nodemailer = require("nodemailer");
const upload = require('../../multer');
const cloudinary = require('../../cloudinary');
const fs = require('fs');
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
let responseMessage;

// --------------------------------------------upload-certificate--------------------
router.post("/upload-certificate", upload.array('image'), async(req, res) => {
    const files = req.files;
    // -----------------------saving certificate------------------------
    for (const file of files) {
        const { path } = file;
        const newPath = await cloudinary.uploads(path, 'Images');
        // ---------------IF ALL GOOD-------------------
        if (newPath.url) {
            res.json([{ status: true, message: `Image uploaded successfuly.`, date: newPath.url }])
        }
        // --------------ERROR------------
        else {
            res.json([{ status: false, message: `Image wasn't uploaded.` }]);
            // logger.error(``);
        }
        //----removes temporary file from server
        fs.unlinkSync(path);
    }
});

// ---------------------------------------------CREATE A NEW USER-------------------------
router.post("/:lang/save", async(req, res) => {
    const language = req.params.lang;
    const { first_name, second_name, phoneN, city, email, password, category, certificate_link, cart, favorites, business } = req.body;
    // -------------------------------------- cripting password-------------------------
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    // ----------------------------------------------------CREATIN USER AND SAVING-----------------------
    const newUser = new UserSchema({
        first_name: first_name.charAt(0).toUpperCase() + first_name.slice(1),
        second_name: second_name.charAt(0).toUpperCase() + second_name.slice(1),
        phoneN: phoneN,
        city: city.charAt(0).toUpperCase() + city.slice(1),
        email: email,
        password: passwordHash,
        category: category,
        certificate_link: certificate_link,
        cart: cart,
        favorites: favorites,
        business: business,
        langueg: language
    });
    try {
        const userToSave = await newUser.save();
        if (userToSave._id) {
            // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `Your request has been put successfully.`
                    break;
                case 'ru':
                    responseMessage = `Ваш запрос был успешно отправлен.`
                    break;
                default:
                    responseMessage = `בקשתך הוגשה בהצלחה.`
                    break;
            }
            // Send message to Luxio----------------------
            emailToAdmin(userToSave);
            // Send message in different languages----------------------
            emailToUser_Info(language);
            res.json([{ status: true, message: responseMessage }]);
            // logger.info(``);
        }
        // ---------------------------ERRORS------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `We have an error. Your request hasn't been put.`
                    break;
                case 'ru':
                    responseMessage = `У нас ошибка. Ваш запрос не отправлен.`
                    break;
                default:
                    responseMessage = `יש לנו שגיאה. בקשתך לא הוגשה..`
                    break;
            }
            res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

// ------------------------------------------------------USER STATUSE CHANGE------------------------
router.get("/:lang/status/:id/:status", async(req, res) => {
    const language = req.params.lang;
    const id = req.params.id;
    const status = req.params.status;
    try {
        const user = await UserSchema.findOne({ "_id": id });
        const statusChange = await UserSchema.updateOne({ "_id": id }, { $set: { "status": status } });
        // -----------------------------------------------------
        if (user && statusChange.nModified === 1) {
            if (status === "false") {
                // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
                switch (language) {
                    case 'en':
                        responseMessage = `Users status has been changed successfully. It was denied.`
                        break;
                    case 'ru':
                        responseMessage = `Статус пользователей успешно изменен. Он был отклонен.`
                        break;
                    default:
                        responseMessage = `סטטוס המשתמשים השתנה בהצלחה. זה נדחה.`
                        break;
                }
                emailToUser_Deny(language);
                res.json([{ status: true, message: responseMessage }]);
                // logger.info(``);
            } else if (status === "true") {
                switch (language) {
                    case 'en':
                        responseMessage = `Users status has been changed successfully. It was approved.`
                        break;
                    case 'ru':
                        responseMessage = `Статус пользователей успешно изменен. Он был одобрен.`
                        break;
                    default:
                        responseMessage = `סטטוס המשתמשים השתנה בהצלחה. זה אושר.`
                        break;
                }
                emailToUser_Confirm(language);
                res.json([{ status: true, message: responseMessage }]);
                // logger.info(``);
            }
            // ---------------------------ERRORS------------------
            else {
                switch (language) {
                    case 'en':
                        responseMessage = `Users status hasn't been changed.`
                        break;
                    case 'ru':
                        responseMessage = `Статус пользователей не изменился.`
                        break;
                    default:
                        responseMessage = `סטטוס המשתמשים לא השתנה.`
                        break;
                }
                res.json([{ status: false, message: responseMessage }]);
                // logger.error(``);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `Users status hasn't been changed.`
                    break;
                case 'ru':
                    responseMessage = `Статус пользователей не изменился.`
                    break;
                default:
                    responseMessage = `סטטוס המשתמשים לא השתנה.`
                    break;
            }
            res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

// ----------------------------------------------------DELETE USER BY ID-------------------
// -------only for admin
router.get('/:lang/delete/user/:id', async(req, res) => {
    const language = req.params.lang;
    const id = req.params.id;
    try {
        let user_toDelete = await UserSchema.remove({ "_id": id });
        if (user_toDelete !== null) {
            // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `User was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь удален.`
                    break;
                default:
                    responseMessage = `המשתמש נמחק.`
                    break;
            }
            res.json([{ status: true, message: responseMessage }]);
            // logger.info(``);
        }
        // ---------------------------ERRORS------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `User not found.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь не найден.`
                    break;
                default:
                    responseMessage = `User not found.`
                    break;
            }
            return res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

// ------------------------------------------Password restore---------------------------------------------------------
router.get('/:lang/password/restore/:email', async(req, res) => {
    const language = req.params.lang;
    const email = req.params.email;
    try {
        let user = await UserSchema.find({ "email": email });
        let userExist = user[0];
        if (userExist) {
            var randomPass = Math.random().toString(36).slice(-8);
            const salt = bcrypt.genSaltSync(10);
            const randomPasswordHash = bcrypt.hashSync(randomPass, salt);
            const passwordChange = await UserSchema.updateOne({ "email": email }, { $set: { "password": randomPasswordHash } });
            if (passwordChange.nModified === 1) {
                newPassEmail(email, randomPass, language);
                // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
                switch (language) {
                    case 'en':
                        responseMessage = `Password has been modified. Temporary password has been sent to <<${email}>>.`
                        break;
                    case 'ru':
                        responseMessage = `Пароль был изменен. Временный пароль отправлен на <<${email}>>.`
                        break;
                    default:
                        responseMessage = `הסיסמה שונתה. סיסמה זמנית נשלחה אל <<${email}>>.`
                        break;
                }
                return res.json([{ status: true, message: responseMessage }]);
                // logger.info(``);
            }
            // ---------------------------ERRORS------------
            else {
                switch (language) {
                    case 'en':
                        responseMessage = `Password hasn't been modified. Please try again.`
                        break;
                    case 'ru':
                        responseMessage = `Пароль не был изменен. Пожалуйста, попробуйте еще раз.`
                        break;
                    default:
                        responseMessage = `הסיסמה לא שונתה. בבקשה נסה שוב.`
                        break;
                }
                return res.json([{ status: false, message: responseMessage }]);
                // logger.error(``);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `User with this email <<${email}>> do not exist.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь с этим адресом электронной почты <<${email}>> не существует.`
                    break;
                default:
                    responseMessage = `משתמש עם דוא"ל זה <<${email}>> לא קיים.`
                    break;
            }
            return res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


// -------------------------------------------------------------EMAILS-------------------------
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
let subject;
let mainText;

// --------------------------------------------Send message to Luxio -(new user)---------------------------------------------------
function emailToAdmin(user) {
    const main = async() => {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: `👻 Request for confirmation ${user.first_name} ${user.second_name}`, // Subject line
            html: `
            <div style="border: grey 1px solid">
            <ul>  
              <li>Name: ${user.first_name} ${user.second_name} </li>
              <li>City: ${user.city}</li>
              <li>Phone number: ${user.phoneN}</li>
              <li>Category: ${user.category}</li>
            </ul>
            <img src="${user.certificate_link}"  style="width: 500px;"/>
            <a href="http://localhost:4200/admin/certificates">On Page</a>
            </div>
          `
        });
    }
    main().catch(console.error);
};

// Send message to user in different languages-------------------------------
function emailToUser_Info(langueg) {
    const main = async() => {
        // ------------------------------------------CHOOSING LANGUAGE-------------------------
        switch (langueg) {
            case 'en':
                subject = `Nails perfect only from AKZENTZ`;
                mainText = `<div style="padding: 5%">
                            <p> Thank you for submitting an application for a personal account. </p>
                            <p> For any additional information, contact the company representative by number:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                            <img src="https://i.pinimg.com/originals/ee/9c/48/ee9c48b36e879ebf783f6246f0926ce6.png" alt="AKZENTZ"/>
                        </div>`;
                break;
            case 'ru':
                subject = `Идеальные ногти только от AKZENTZ`;
                mainText = `<div style="padding: 5%;">
                            <p> Спасибо, что подали заявку на открытие личного акаунта. </p>
                            <p> За дополнительной информацией обращайтесь к представителю компании по номеру: </p>
                            <p> 054-8785521 / 055-9519777 </p>
                            <img src="https://i.pinimg.com/originals/ee/9c/48/ee9c48b36e879ebf783f6246f0926ce6.png" alt="AKZENTZ"/>
                        </div>`;
                break;
            default:
                subject = `ציפורניים מושלמות רק מבית AKZENTZ`;
                mainText = `<div style="padding: 5%; text-align: right; direction: rtl;">
                            <p> תודה שביקשתם חשבון אישי. </p>
                            <p> לקבלת מידע נוסף, צרו קשר עם נציג החברה במספר:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                            <img src="https://i.pinimg.com/originals/ee/9c/48/ee9c48b36e879ebf783f6246f0926ce6.png" alt="AKZENTZ"/>
                        </div>`;
                break;
        }
        // ------------------------------------------------sending------------
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: subject, // Subject line
            html: mainText //main text
        });
    }
    main().catch(console.error);
};

// -------------------------------------------------------REJECTING USER----------------------------
function emailToUser_Deny(langueg) {
    const main = async() => {
        // ------------------------------------------CHOOSING LANGUAGE-------------------------
        switch (langueg) {
            case 'en':
                subject = `Request was rejected`;
                mainText = `<div style="border: red 1px solid; padding: 5%">
                            <p> Your request to get a personal account for online purchases from <a href="http://localhost:4200">Luxio website</a> was rejected.</p>
                            <p> To change this status or get additional information, contact the company representative by number:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
            case 'ru':
                subject = `В запросе было отказано`;
                mainText = `<div style="border: red 1px solid; padding: 5%">
                            <p> Ваш запрос на получение личного аккаунта для покупок в Интернете с сайта <a href="http://localhost:4200">Luxio</a> был отклонен.</p>
                            <p> За дополнительной информацией обращайтесь к представителю компании по номеру: </p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
            default:
                subject = `בקשה נדחה`;
                mainText = `<div style="border: red 1px solid; padding: 5%; text-align: right; direction: rtl;">
                            <p> בקשתך לקבל חשבון אישי לרכישות מקוונות מ<a href="http://localhost:4200">Luxio</a> נדחה.</p>
                            <p> לקבלת מידע נוסף, צרו קשר עם נציג החברה במספר:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
        }
        // ------------------------------------------------sending------------
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: subject, // Subject line
            html: mainText //main text
        });
    }
    main().catch(console.error);
};

// -------------------------------------------------------APPROVING USER----------------------------
function emailToUser_Confirm(langueg) {
    const main = async() => {
        // ------------------------------------------CHOOSING LANGUAGE-------------------------
        switch (langueg) {
            case 'en':
                subject = `Request was approved`;
                mainText = `<div style="border: green 1px solid; padding: 5%">
                            <p> Your request to get a personal account for online purchases from <a href="http://localhost:4200">Luxio website</a> was approved.</p>
                            <p> Now you can order any goods directly from our website. </p>
                            <p> For any additional information, contact the company representative by number:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
            case 'ru':
                subject = `Запрос был одобрен`;
                mainText = `<div style="border: green 1px solid; padding: 5%">
                            <p> Ваш запрос на получение личного кабинета для покупок в Интернете от <a href="http://localhost:4200">Luxio</a> был одобрен.</p>
                            <p> Теперь Вы можете заказывать любые товары прямо с нашего сайта. </p>
                            <p> За дополнительной информацией обращайтесь к представителю компании по номеру: </p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
            default:
                subject = `הבקשה אושרה`;
                mainText = `<div style="border: green 1px solid; padding: 5%; text-align: right; direction: rtl;">
                            <p> בקשתך לקבל חשבון אישי לרכישות מקוונות מ <a href="http://localhost:4200">Luxio</a> אושרה.</p>
                            <p> עכשיו אתה יכול להזמין כל סחורה ישירות מהאתר שלנו. </p>
                            <p> לקבלת מידע נוסף, צרו קשר עם נציג החברה במספר:</p>
                            <p> 054-8785521 / 055-9519777 </p>
                        </div>`;
                break;
        }
        // ------------------------------------------------sending------------
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: subject, // Subject line
            html: mainText //main text
        });
    }
    main().catch(console.error);
};

// ------------------------------------------Password restore---------------------------------------------------------
function newPassEmail(email, randomPass, language) {
    const main = async() => {
        // ------------------------------------------CHOOSING LANGUAGE-------------------------
        switch (language) {
            case 'en':
                subject = `From Luxio website`;
                mainText = `<p>Temporary password: ${randomPass}</p>`;
                break;
            case 'ru':
                subject = `מאתר Luxio`;
                mainText = `<p>סיסמא זמנית: ${randomPass}</p>`;
                break;
            default:
                subject = `С сайта Luxio`;
                mainText = `<p>Временный пароль: ${randomPass}`;
                break;
        }
        // ------------------------------------------------sending------------
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: mainText
        });
    }
    main().catch(console.error);
}


module.exports = router;