const express = require('express');
const router = express.Router();
// const passwordValidation = require('./validSchema');
// const bcrypt = require('bcryptjs');
// const pool = require('../DB/pool')

// router.use(passwordValidation);

router.post("/registration", async(req, res, next) => {
    console.log(req.body);
    // const { users_email, password, users_first_name, users_last_name } = req.body;
    // // console.log(users_email, password, users_first_name, users_last_name)

    // const ifUserExist_res = await pool.execute(ifUserExist(), [users_email]);
    // if (ifUserExist_res[0][0]) {
    //     return res.json({ message: 'user allready exist' });
    // } else {
    //     const salt = bcrypt.genSaltSync(10);
    //     const hash = bcrypt.hashSync(password, salt);
    //     const addNewUser_res = await pool.execute(addUserTo_DB(), [users_email, users_first_name, users_last_name, hash]);
    //     res.json({ message: 'user is added !!!!', redirect: true });
    // }
})

function ifUserExist() {
    return `SELECT * FROM vacations_project.users WHERE users_email = ?  ;`
}

function addUserTo_DB() {
    return `INSERT INTO luxio_db.users_inf ( id, f_name, s_name, phone_number, city, email, cr_pass, category, certificate_link )
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?);`
}

module.exports = router;