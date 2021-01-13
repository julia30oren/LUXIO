const express = require('express');
const router = express.Router();
const OrderSchema = require('./order-model');
const nodemailer = require("nodemailer");
const UserSchema = require('../user/user-model');
const logger = require('../../logger');
const moment = require("moment");

let responseMessage;

// ---------------------------------------------------GET ALL orders-----------------------------
router.get('/', async(req, res) => {
            try {
                const allOrders = await OrderSchema.find().sort({ 'order_date': -1 }); //get them sorted by name
                return res.json([{ status: true, allOrders }]);
            } catch (err) {
                logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});

// ---------------------------------------------------GET ALL orders of ONE USER-----------------------------
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const userOrders = await OrderSchema.find({ "shipping_details._id": id }).sort({ 'order_date': -1 }); //get them sorted by name
        return res.json([{ status: true, userOrders }]);
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});

// ------------------------------------------------------SAVE NEW ORDER-------------------------------
router.post("/:lang/save", async(req, res, next) => {
    const language = req.params.lang;
    const { order, payments, shipping_details } = req.body;
let time = moment().format(`h:mm:ss a`);

    try {
        // ----------------------------we are creating new ORDER:
        const newOrder = new OrderSchema({
            order: order,
            payments: payments,
            shipping_details: shipping_details
        });

        // ---------------------------SAVING NEW---------------------
        try {
            const orderToSave = await newOrder.save();
            if (orderToSave._id) {
                let user_id = shipping_details._id;
                // ----------------------depending on language -  different response:
                switch (language) {
                    case 'en':
                        responseMessage = `The order was placed successfully.`
                        break;
                    case 'ru':
                        responseMessage = `Заказ был размещен успешно.`
                        break;
                    default:
                        responseMessage = `ההזמנה בוצעה בהצלחה.`
                };
                const cartRestart = await UserSchema.update({ "_id": user_id }, { $set: { "cart": [] } });
                logger.info(`${time} - ${responseMessage} Order id ${orderToSave._id}`);
                // send an email to admin
                emailToAdmin_ORDER(language, time, newOrder);
                return res.json([{ status: true, message: responseMessage }]);
            }
            //-------------------------------ERRORS-------
            else {
                switch (language) {
                    case 'en':
                        responseMessage = `The order was not placed.`
                        break;
                    case 'ru':
                        responseMessage = `Заказ не размещен.`
                        break;
                    default:
                        responseMessage = `ההזמנה לא בוצעה.`
                };
                logger.error(`${time} - ${responseMessage}`);
                return res.json([{ status: false, message: responseMessage }]);
            }
        } catch (err) {
            logger.error(`${time} - ${err.message}`);
            return res.json([{ status: false, message: err.message }]);
        }
    } catch (err) {
        logger.error(`${time} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});

// ----------------------------------------------------DELETE ORDER-------------------
// -------only for me
router.get('/:lang/delete/:id', async(req, res) => {
    const language = req.params.lang;
    const id = req.params.id;
    try {
        let order_toDelete = await OrderSchema.remove({ "_id": id });
        if (order_toDelete !== null) {
            // ------------------------------------------------------CHOOSING LANGUAGE for response-------------------------
            switch (language) {
                case 'en':
                    responseMessage = `Order was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Заказ удален.`
                    break;
                default:
                    responseMessage = `ההזמנה נמחקה.`
                    break;
            };
            logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // ---------------------------ERRORS------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Order not found.`
                    break;
                case 'ru':
                    responseMessage = `Заказ не найден.`
                    break;
                default:
                    responseMessage = `ההזמנה לא נמצאה.`
                    break;
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});

// ------------------------------------------------------ORDER STATUSE CHANGE------------------------
router.get("/:lang/status/:id/:status", async(req, res) => {
    const language = req.params.lang;
    const id = req.params.id;
    const status = req.params.status;
    try {
        const order = await OrderSchema.findOne({ "_id": id });
        const statusChange = await OrderSchema.updateOne({ "_id": id }, { $set: { "received": status } });
        // -----------------------------------------------------
        if (order && statusChange.nModified === 1) {

            switch (language) {
                case 'en':
                    responseMessage = `Order status has been changed successfully.`
                    break;
                case 'ru':
                    responseMessage = `Статус заказа успешно изменен.`
                    break;
                default:
                    responseMessage = `סטטוס ההזמנה השתנה בהצלחה.`
                    break;
            };
            logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage} Order id ${id}`);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // ---------------------------ERRORS------------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Order status hasn't been changed.`
                    break;
                case 'ru':
                    responseMessage = `Статус заказа не изменился.`
                    break;
                default:
                    responseMessage = `סטטוס ההזמנה לא השתנה.`
                    break;
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage} Order id ${id}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
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
// Send an email to admin-------------------------------
function emailToAdmin_ORDER(langueg, time, newOrder) {
    // console.log(langueg, time, newOrder)
    const main = async() => {
        // ------------------------------------------CHOOSING LANGUAGE-------------------------
        switch (langueg) {
            case 'en':
                subject = `New order ${time}`;
                mainText = `<div style="padding: 5%; border-top: solid black 2px;">
                                <p>user id: ${newOrder.shipping_details._id}</p>
                                <p>name: ${newOrder.shipping_details.first_name} ${newOrder.shipping_details.second_name}</p>
                                <p>email: ${newOrder.shipping_details.email}</p>
                                <p>phone number: ${newOrder.shipping_details.phoneN}</p>
                                <p>state: ${newOrder.shipping_details.state}</p>
                                <p>city: ${newOrder.shipping_details.city}</p>
                                <p>street: ${newOrder.shipping_details.street}</p>
                                <p>home: ${newOrder.shipping_details.home}</p>
                                <p>apartment: ${newOrder.shipping_details.apartment}</p>
                                <p>zip: ${newOrder.shipping_details.zip}</p>
                            </div>
                            <plaintext style="padding: 5%; border-top: solid black 2px; border-bottom: solid black 2px;">
                                <p>order: ${JSON.stringify(newOrder.order)}</p>
                            </plaintext>`;
                break;
            case 'ru':
                subject = ``;
                mainText = `<div style="padding: 5%;">
                            </div>`;
                break;
            default:
                subject = ``;
                mainText = `<div style="padding: 5%; text-align: right; direction: rtl;">
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

module.exports = router;