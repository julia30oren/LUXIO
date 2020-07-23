const express = require('express');
const router = express.Router();
// const passwordValidation = require('./validSchema');
// const bcrypt = require('bcryptjs');
const pool = require('../DB/pool');

// router.use(passwordValidation);

router.get("/", async(req, res, next) => {
    const list = await pool.execute(getProducts());
    const resoult = list[0];
    res.json(resoult);
});



router.post("/saveNewProd", async(req, res) => {
    // console.log(req.body);
    const { id, first_name, second_name, phoneN, city, email, password, category, certificate_link } = req.body;
    // console.log(id, first_name, second_name, phoneN, city, email, password, category, certificate_link);

    const save_user = await pool.execute(addUserTo_DB(), [id, first_name, second_name, phoneN, city, email, password, category, certificate_link]);
    console.log(save_user);
    res.json(save_user);
    // if (ifUserExist_res[0][0]) {
    //     return res.json({ message: 'user allready exist' });
    // } else {
    //     const salt = bcrypt.genSaltSync(10);
    //     const hash = bcrypt.hashSync(password, salt);
    //     const addNewUser_res = await pool.execute(addUserTo_DB(), [users_email, users_first_name, users_last_name, hash]);
    //     res.json({ message: 'user is added !!!!', redirect: true });
    // }
});



function getProducts() {
    return `SELECT * FROM luxio_db.shop
            ORDER BY prod_name;`
}

function addUserTo_DB() {
    return `INSERT INTO luxio_db.users_inf ( id, f_name, s_name, phone_number, city, email, cr_pass, category, certificate_link )
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?);`
}

function addUserSstatusTo_DB() {
    return `UPDATE luxio_db.users_inf
            SET approved = ?
            WHERE id=?;`
}

module.exports = router;