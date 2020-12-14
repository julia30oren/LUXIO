const express = require('express');
const router = express.Router();
const OrderSchema = require('./order-model');
const UserSchema = require('../user/user-model');

// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
let responseMessage;


// ---------------------------------------------------GET ALL orders-----------------------------
router.get('/', async(req, res) => {
    try {
        const allOrders = await OrderSchema.find().sort({ 'order_date': -1 }); //get them sorted by name
        res.json([{ status: true, allOrders }]);
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

// ---------------------------------------------------GET ALL orders of ONE USER-----------------------------
router.get('/:id', async(req, res) => {
    try {
        const userOrders = await OrderSchema.find().sort({ 'order_date': -1 }); //get them sorted by name
        res.json([{ status: true, userOrders }]);
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});

// ------------------------------------------------------SAVE NEW ORDER-------------------------------
router.post("/:lang/save", async(req, res, next) => {
    const language = req.params.lang;
    const { order, payments, shipping_details } = req.body;
    // creating new product-----------------------
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
                res.json([{ status: true, message: responseMessage }]);
                // logger.info(``);
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
                }
                res.json([{ status: false, message: responseMessage }]);
                // logger.error(``);
            }
        } catch (err) {
            res.json([{ status: false, message: err.message }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
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
            }
            res.json([{ status: true, message: responseMessage }]);
            // logger.info(``);
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
            }
            return res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
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
            }
            res.json([{ status: true, message: responseMessage }]);
            // logger.info(``);
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
            }
            res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


module.exports = router;