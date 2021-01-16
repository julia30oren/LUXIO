const express = require('express');
const router = express.Router();
const AdminSchema = require('./admin/admin-model');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const moment = require("moment");

const salt = bcrypt.genSaltSync(10);
// var schema = new mongoose.Schema({ name: 'string', size: 'string' });
const schema = new Schema({
    email: {
        type: String,
        require: true,
        default: process.env.LuxioEmail,
    },
    main_password: {
        type: String,
        require: true,
        default: bcrypt.hashSync(process.env.secretPASSWORD, salt),
    },
    admin_name: {
        type: String,
        require: true,
        default: process.env.mainAdmin.charAt(0).toUpperCase() + process.env.mainAdmin.slice(1),
    },
    admin_password: {
        type: String,
        require: true,
        default: bcrypt.hashSync(process.env.SMTPHOSTEMAILPASSWORD, salt),
    },
});
var admins = mongoose.model('admins', schema);
// -------------------------------------------------CREATE MAIN ADMIN-------------------------
router.get('/', async(req, res) => {
            console.log('start')
            let name = process.env.mainAdmin.charAt(0).toUpperCase() + process.env.mainAdmin.slice(1)
            const adminExist = await AdminSchema.findOne({ "admin_name": name });

            if (!adminExist) {
                const salt = bcrypt.genSaltSync(10);
                const main_passwordHash = bcrypt.hashSync(process.env.secretPASSWORD, salt);
                const private_passwordHash = bcrypt.hashSync(process.env.SMTPHOSTEMAILPASSWORD, salt);
                // -------------------------------------------all passwords were cripted------------------
                const newAdmin = new AdminSchema({
                    email: process.env.LuxioEmail,
                    main_password: main_passwordHash,
                    admin_name: name,
                    admin_password: private_passwordHash,
                });
                try {
                    const newAdmin_toSave = await newAdmin.save();
                    if (newAdmin_toSave._id) {
                        logger.info(`${moment().format(`h:mm:ss a`)} - Main Admin was created successfully.`);
                return res.json([{ status: true, message: `Main Admin was created successfully.` }]);
            }
            // -------------------------ERRORS--------------
            else {
                logger.error(`${moment().format(`h:mm:ss a`)} - An error has occurred. Main Admin was not added.`);
                return res.json([{ status: false, message: `An error has occurred. Main Admin was not added.` }]);
            }
        } catch (err) {
            logger.error(`${moment().format(`h:mm:ss a`)} - ${err}`);
            return res.json([{ status: false, message: err.message }]);
        }
} else {
console.log([{ status: false, message: `Main Admin exist.` }]);
}
});


module.exports = router;