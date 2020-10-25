const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserSchema = require('./register-model');


// ------------------------------------------------------------------------- GET USERS INFO BY ID ------------------------------
router.get("/:id", async(req, res) => {
    // -------------------------------------------------- requested parameters -----
    const id = req.params.id;
    // -------------------------------
    try {
        const user = await UserSchema.find({ "_id": id });
        if (user[0]) {
            return res.json(user);
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else return res.json({ message: `User with id <<${id}>> don't exist` });
    } catch (err) {
        return res.json({ message: err.message });
    }
});


// ------------------------------------------------------------------------- USER UPDATING personal information ------------------------------
router.post("/user-props", async(req, res) => {
    // -------------------------------------------------- requested parameters ---------------------------------------------
    const { _id, email, first_name, second_name, phoneN, city, state, street, home, apartment, zip } = req.body;
    try {
        // ------------------------------------------------ updating -------------------
        const userInfoToSave = await UserSchema.updateMany({ "_id": _id }, {
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
            return res.json({ message: `Updates to <<Personal information>> has been saved successfully.` });
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else return res.json({ message: `Something went wrong. <<Personal information>> hasn't been updated.` });
    } catch (err) {
        return res.json({ message: err.message });
    }
});


// ------------------------------------------------------------------------- USER UPDATING FAVORITES ------------------------------
router.post("/new-favorites", async(req, res) => {
    // -------------------------------------------------- requested parameters -----
    const { _id, favorites } = req.body;
    //--------------------------------------------------- update users favorites -------------
    try {
        const favoritesToSave = await UserSchema.update({ "_id": _id }, { $set: { "favorites": favorites } });
        if (favoritesToSave.nModified === 1) {
            return res.json({ message: `Updates to <<Favorites>> has been saved successfully.` });
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else return res.json({ message: `Something went wrong. <<Favorites>> hasn't been updated.` });
    } catch (err) {
        return res.json({ message: err.message })
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
            return res.json({ message: `Updates to <<Cart>> has been saved successfully.` });
        }
        // --------------------------------------------------------------------------------- ERRORS --
        else return res.json({ message: `Something went wrong. <<Cart>> hasn't been updated.` });
    } catch (err) {
        return res.json({ message: err.message });
    }
});


// ------------------------------------------------------------------------- USER CHANGING PASSWORD ------------------------------
router.post("/:id/new-password", async(req, res) => {
    // -------------------------------------------------- requested parameters -----
    const email = req.params.id;
    const oldPassword = req.body.old_pass;
    const newPassword = req.body.new_pass;
    //--------------------------------------------------- find user and compare old password ---
    try {
        const loginU = await UserSchema.find({ "email": email });
        const User = loginU[0];
        if (User) {
            const hush = User.password;
            const cryptoPassChek = bcrypt.compareSync(oldPassword, hush);
            if (cryptoPassChek) {
                // -------------------------------------- cripting new password and saving it --
                const salt = bcrypt.genSaltSync(10);
                const passwordHash = bcrypt.hashSync(newPassword, salt);
                const save_newPassword = await UserSchema.update({ "email": email }, {
                    $set: {
                        "password": passwordHash,
                    }
                });
                if (save_newPassword.nModified === 1) {
                    // ------------------------------------------------------------ if success -----
                    res.json(`<<Password>> has been saved successfully.`);
                }
                // ---------------------------------------------------------------------------- ERRORS -----
                else res.json(`Something went wrong. <<Password>> wasn't changed.`);
            } else res.json(`<<Old password>> don't match.`);
        } else res.json(`<<User>> with email <<${email}>> not found.`);
    } catch (err) {
        return res.json({ message: err.message });
    }
});



module.exports = router;