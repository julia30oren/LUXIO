const express = require('express');
const router = express.Router();
// const passwordValidation = require('./validSchema');
// const bcrypt = require('bcryptjs');
const pool = require('../../DB/pool');
const UserSchema = require('./register-model');
// router.use(passwordValidation);
const nodemailer = require("nodemailer");

const upload = require('../../multer');
const cloudinary = require('../../cloudinary');
const fs = require('fs');

router.post("/upload-images", upload.array('image'), async(req, res) => {
    const files = req.files;
    console.log(files);

    for (const file of files) {
        const { path } = file;
        const newPath = await cloudinary.uploads(path, 'Images');

        if (newPath.url) {
            res.status(200).json({
                message: "Images uploaded successfuly",
                date: newPath.url
            })
        } else res.json({
            message: "Error"
        })

        //removes temporary file from server
        fs.unlinkSync(path);
    }
});


router.get("/users", async(req, res, next) => {
    // console.log('get from server')

    try {
        const allUsers = await UserSchema.find();
        res.json(allUsers);
    } catch (err) {
        res.status(404).json({ message: ` We have an error on server : ${err.message}` })
    }
});

router.post("/saveNew", async(req, res) => {
    // console.log(req.body);
    const newUser = new UserSchema({
        first_name: req.body.first_name.charAt(0).toUpperCase() + req.body.first_name.slice(1),
        second_name: req.body.second_name.charAt(0).toUpperCase() + req.body.second_name.slice(1),
        phoneN: req.body.phoneN,
        city: req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1),
        email: req.body.email,
        password: req.body.password,
        category: req.body.category,
        certificate_link: req.body.certificate_link || 'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg',
    });
    // console.log(newUser);
    // emailToAdmin(newUser.first_name, newUser.second_name, newUser.phoneN, newUser.city, newUser.category, newUser.certificate_link);

    try {
        const userToSave = await newUser.save();
        if (userToSave._id) {
            emailToAdmin(userToSave._id, userToSave.first_name, userToSave.second_name, userToSave.phoneN, userToSave.city, userToSave.category, userToSave.certificate_link);

            res.status(200).json([{ state: 1, message: `User was added successfully.` }]);
            // logger.info(`${now} - New product posted "${itemToSave.name}"`);
        } else {
            res.status(406).json({ message: ` We have an error.` });
            // logger.error(`${now} - We have an error with posting new product`);
        }
    } catch (err) {
        logger.error(`${now} - We have an error with posting new user`);
        res.status(406).json({ message: ` We have an error with data : ${err.message}` })
    }
});

router.get("/user-status/:id/:name", async(req, res) => {
    // console.log(req.params.id);
    const statusChange = await UserSchema.update({ "_id": req.params.id }, {
        $set: {
            "status": req.params.name
        }
    });
    if (statusChange.nModified === 1) {
        if (req.params.name === "false") {
            let thisUser = await UserSchema.find({ "_id": req.params.id });
            emailToUser_Deny(thisUser);
        } else if (req.params.name === "true") {
            let thisUser = await UserSchema.find({ "_id": req.params.id });
            emailToUser_Confirm(thisUser);
        }
        res.status(200).json([statusChange]);
    }

});


function emailToAdmin(first_name, second_name, phoneN, city, category, certificate_link) {
    const main = async() => {
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

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: `👻 Request for confirmation ${first_name} ${second_name}`, // Subject line
            html: `
            <div style="border: grey 1px solid">
            <ul>  
              <li>Name: ${first_name} ${second_name} </li>
              <li>City: ${city}</li>
              <li>Phone number: ${phoneN}</li>
              <li>Category: ${category}</li>
            </ul>
            <img src="${certificate_link}"  style="width: 500px;"/>
            <a href="http://localhost:4200/admin/certificates">On Page</a>
            </div>
          `
        });
    }
    main().catch(console.error);
};

function emailToUser_Deny(user) {
    // console.log(user[0]);
    const main = async() => {
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

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: `👻 Request for confirmation ${user[0].first_name} ${user[0].second_name} was rejected`, // Subject line
            html: `
            <div style="border: red 1px solid; padding: 5%">
                <p> Your request to get a personal account for online purchases from <a href="http://localhost:4200">Luxio website</a> site was rejected.</p>
                <p> To change this status or get additional information, contact the company representative by number:</p>
                <p> 054-8785521 / 055-9519777 </p>
            </div>
          `
        });
    }
    main().catch(console.error);
};

function emailToUser_Confirm(user) {
    // console.log(user);

    const main = async() => {
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

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.SMTPHOSTEMAILUSER, // sender address
            to: process.env.DESIGNATEDSUPPORTEMAIL, // list of receivers
            subject: `👻 Request for confirmation ${user[0].first_name} ${user[0].second_name} was approved`, // Subject line
            html: `
            <div style="border: green 1px solid; padding: 5%">
                <p> Your request to get a personal account for online purchases from <a href="http://localhost:4200">Luxio website</a> site was approved.</p>
                <p> Now you can order any goods directly from our website. </p>
                <p> For any additional information, contact the company representative by number:</p>
                <p> 054-8785521 / 055-9519777 </p>
            </div>
          `
        });
    }
    main().catch(console.error);
};


module.exports = router;