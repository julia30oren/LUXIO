const express = require('express');
const router = express.Router();
const UserSchema = require('./register/register-model');

router.get("/:id", async(req, res) => {
    try {
        const user = await UserSchema.find({ "_id": req.params.id });
        return res.status(200).send(user)
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
});

router.post("/user-props", async(req, res) => {
    console.log(req.body)
    try {
        const salt = bcrypt.genSaltSync(10);
        let newPass = bcrypt.hashSync(req.body.password, salt);
        const user = await UserSchema.updateMany({ "_id": req.body._id }, {
            $set: {
                "email": req.body.email,
                "first_name": req.body.first_name,
                "second_name": req.body.second_name,
                "phoneN": req.body.phoneN,
                "password": newPass,
                "city": req.body.city,
                "state": req.body.state,
                "street": req.body.street,
                "home": req.body.home,
                "apartment": req.body.apartment,
                "zip": req.body.zip
            }
        });
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
});

router.post("/new-favorites", async(req, res) => {
    try {
        const user = await UserSchema.update({ "_id": req.body._id }, {
            $set: {
                "favorites": req.body.favorites,
            }
        });
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
});

router.post("/new-cart", async(req, res) => {
    // console.log(req.body._id, req.body.cart)
    try {
        const user = await UserSchema.update({ "_id": req.body._id }, {
            $set: {
                "cart": req.body.cart,
            }
        });
        return res.status(200).send({ message: 'good' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
});

module.exports = router;