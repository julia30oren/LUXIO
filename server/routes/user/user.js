const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const UserSchema = require('./user-model');
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
let responseMessage;


// -----------------------------------GET ALL USERS---------------
// ----------------------------------------------------only for admin---------
router.get("/", async(req, res, next) => {
    try {
        const allUsers = await UserSchema.find();
        res.json([{ status: true, allUsers }]);
    } catch (err) {
        res.json([{ status: true, message: err.message }]);
        // logger.error(``);
    }
});

// ------------------------------------------------------------------------- GET USER INFO BY ID ------------------------------
router.get("/:lang/:id", async(req, res) => {
    const id = req.params.id;
    const language = req.params.lang;
    // ----------------------------SEARCH---
    try {
        const user = await UserSchema.findOne({ "_id": id });
        if (user) {
            return res.json([{ status: true, user }]);
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else {
            // ---------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `User with id <<${id}>> don't exist.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь с идентификатором <<${id}>> не существует.`
                    break;
                default:
                    responseMessage = `משתמש עם מזהה <${id}>> אינו קיים.`
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

// --------------------------------------------------USER LOGIN------------------
router.post('/:lang/login', async(req, res) => {
    const { email, password } = req.body;
    const language = req.params.lang;
    // ----------------------if user exist----------------
    try {
        const loginUser = await UserSchema.find({ "email": email });
        const User = loginUser[0];
        if (User) {
            // ----checking password----
            const hush = User.password;
            const cryptoPassChek = bcrypt.compareSync(password, hush);
            if (cryptoPassChek) {
                const userToken = JWT.sign({ email }, process.env.SECRET, { expiresIn: '24h' }); // creating token
                // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
                switch (language) {
                    case 'en':
                        responseMessage = `User <<${email}>> logged in.`
                        break;
                    case 'ru':
                        responseMessage = `Пользователь <<${email}>> вошел в систему.`
                        break;
                    default:
                        responseMessage = `המשתמש <<${email}>> התחבר.`
                        break;
                }
                res.json(
                    [{
                        state: true,
                        token: userToken,
                        message: responseMessage,
                        user: {
                            _id: User._id,
                            first_name: User.first_name,
                            second_name: User.second_name,
                            favorites: User.favorites,
                            cart: User.cart
                        }
                    }]
                );
            }
            // ---------------------------ERRORS------------
            else {
                switch (language) {
                    case 'en':
                        responseMessage = `<<Password>> don't match.`
                        break;
                    case 'ru':
                        responseMessage = `<<Пароль>> не совпадает.`
                        break;
                    default:
                        responseMessage = `<<סיסמה>> אינם תואמים.`
                        break;
                }
                res.json([{ state: false, message: responseMessage }]);
                // logger.error(``);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `User <<${email}>> don't exist.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь <<${email}>> не существует.`
                    break;
                default:
                    responseMessage = `משתמש <<${email}>> לא קיים.`
                    break;
            }
            res.json([{ state: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ state: false, message: err.message }]);
        // logger.error(``);
    }
});

// ------------------------------------------------------------------------- USER UPDATING personal information ------------------------------
router.post("/:lang/update/:id", async(req, res) => {
    const id = req.params.id;
    const language = req.params.lang;
    const { email, first_name, second_name, phoneN, city, state, street, home, apartment, zip } = req.body;
    try {
        // ------------------------------------------------ updating -------------------
        const userInfoToSave = await UserSchema.updateMany({ "_id": id }, {
            $set: {
                "email": email,
                "first_name": first_name,
                "second_name": second_name,
                "phoneN": phoneN,
                "city": city,
                "state": state,
                "street": street,
                "home": home,
                "apartment": apartment,
                "zip": zip
            }
        });
        if (userInfoToSave.nModified === 1) {
            // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `Updates to <<Personal information>> has been saved successfully.`
                    break;
                case 'ru':
                    responseMessage = `Обновления для <<Личной информации>> успешно сохранены.`
                    break;
                default:
                    responseMessage = `עדכונים ל <<מידע אישי>> נשמרו בהצלחה.`
                    break;
            }
            return res.json([{ status: true, message: responseMessage }]);
            // logger.info(``);
        }
        // ----------------------------------------- ERRORS --
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Something went wrong. <<Personal information>> hasn't been updated.`
                    break;
                case 'ru':
                    responseMessage = `Что-то пошло не так. <<Личная информация>> не была обновлена.`
                    break;
                default:
                    responseMessage = `משהו השתבש. <<מידע אישי>> לא עודכן.`
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

// ----------------------------------------------- USER CHANGING PASSWORD in Personal information------------------------------
router.post("/:lang/newpass/:email", async(req, res) => {
    const email = req.params.email;
    const language = req.params.lang;
    const { oldPassword, newPassword } = req.body;
    //--------------------------------------------------- find user and compare old password ---
    try {
        const loginU = await UserSchema.find({ "email": email });
        const User = loginU[0]; //object
        if (User) {
            const hush = User.password;
            const cryptoPassChek = bcrypt.compareSync(oldPassword, hush);
            console.log(cryptoPassChek)

            if (cryptoPassChek) {
                // -------------------------------------- cripting new password and saving it --
                const salt = bcrypt.genSaltSync(10);
                const passwordHash = bcrypt.hashSync(newPassword, salt);
                // -----------------------------------------------------SAVING---------------
                const save_newPassword = await UserSchema.update({ "email": email }, { $set: { "password": passwordHash } });
                // ------------------------------------------------------------ if success -----
                if (save_newPassword.nModified === 1) {
                    // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
                    switch (language) {
                        case 'en':
                            responseMessage = `<<New password>> has been saved successfully.`
                            break;
                        case 'ru':
                            responseMessage = `<<Новый пароль>> Сохранено успешно.`
                            break;
                        default:
                            responseMessage = `<< סיסמה חדשה >> נשמרה בהצלחה.`
                            break;
                    }
                    res.json([{ status: true, message: responseMessage }]);
                    // logger.info(``);
                }
                // ---------------------------------------------------------------------------- ERRORS -----
                else {
                    switch (language) {
                        case 'en':
                            responseMessage = `Something went wrong. <<Password>> wasn't changed.`
                            break;
                        case 'ru':
                            responseMessage = `Что-то пошло не так. <<Пароль>> не был изменен.`
                            break;
                        default:
                            responseMessage = `משהו השתבש. <<סיסמה>> לא שונה.`
                            break;
                    }
                    res.json([{ status: false, message: responseMessage }]);
                    // logger.error(``);
                }
            } else {
                switch (language) {
                    case 'en':
                        responseMessage = `<<Old password>> don't match.`
                        break;
                    case 'ru':
                        responseMessage = `<<Старый пароль>> не совпадает.`
                        break;
                    default:
                        responseMessage = `<< סיסמה ישנה >> אינה תואמת.`
                        break;
                }
                res.json([{ status: false, message: responseMessage }]);
                // logger.error(``);
            }
        } else {
            switch (language) {
                case 'en':
                    responseMessage = `User with email <<${email}>> not found.`
                    break;
                case 'ru':
                    responseMessage = `Пользователь с адресом электронной почты <<${email}>> не найден.`
                    break;
                default:
                    responseMessage = `משתמש עם דוא"ל <<${email}>> לא נמצא.`
                    break;
            }
            res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


// ------------------------------------------------------------------------- USER UPDATING CART ------------------------------
router.post("/new-cart", async(req, res) => {
    // -------------------------------------------------- requested parameters -----
    const { _id, cart } = req.body;
    //--------------------------------------------------- update users cart -------------
    try {
        const cartToSave = await UserSchema.update({ "_id": _id }, { $set: { "cart": cart } });
        if (cartToSave.nModified === 1) {
            return res.json([{ status: true, message: `Updates to <<Cart>> has been saved successfully.` }]);
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else {
            return res.json([{ status: false, message: `Something went wrong. <<Cart>> hasn't been updated.` }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


// ------------------------------------------------------------------------- USER UPDATING FAVORITES ------------------------------
router.post("/new-favorites", async(req, res) => {
    const { _id, favorites } = req.body;
    //--------------------------------------------------- update users favorites -------------
    try {
        const favoritesToSave = await UserSchema.update({ "_id": _id }, { $set: { "favorites": favorites } });
        if (favoritesToSave.nModified === 1) {
            return res.json([{ status: true, message: `Updates to <<Favorites>> has been saved successfully.` }]);
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else {
            return res.json([{ status: false, message: `Something went wrong. <<Favorites>> hasn't been updated.` }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

module.exports = router;