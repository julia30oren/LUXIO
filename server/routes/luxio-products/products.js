const express = require('express');
const router = express.Router();
const oldProductSchema = require('../products/product-model');
const ProductSchema = require('./product-model');
const logger = require('../../logger');
const moment = require("moment");

let responseMessage;

// ---------------------------------------------------GET ALL PRODUCTS-----------------------------
router.get('/', async(req, res) => {
            try {
                const allProductes = await ProductSchema.find().sort({ 'prod_class': 1, 'burcode_id': 1 }); //get them sorted by name
                return res.json([{ status: true, allProductes }]);
            } catch (err) {
                logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
                return res.json([{ status: false, message: err.message }]);
    }
});


// ------------------------------------------------------SAVE NEW PRODUCT OR CHANGE OLD ONE-------------------------------
router.post("/:lang/save", async(req, res, next) => {
    const language = req.params.lang;
    const { prod_burcode, prod_class, prod_name, extra_inf, quantity_options, images, comments} = req.body;
    // creating new product-----------------------
    try {
        // ---------------------------------------------------CHECK if item already exist BY BURCODE--------
        let thisItem = await ProductSchema.findOne({ "prod_burcode": prod_burcode });
        // ----------------------------IF NOT we are creating new:
        if (!thisItem) {
            const newProduct = new ProductSchema({
                prod_burcode: prod_burcode,
                prod_class: prod_class,
                prod_name: prod_name.toUpperCase(),
                extra_inf: extra_inf,
                quantity_options: quantity_options, 
                images: images, 
                comments: comments
            });
            // ---------------------------SAVING NEW---------------------
            try {
                const itemToSave = await newProduct.save();
                if (itemToSave._id) {
                    // ----------------------depending on language -  different response:
                    switch (language) {
                        case 'en':
                            responseMessage = `Product «${prod_class} ${prod_name}» was added successfully.`
                            break;
                        case 'ru':
                            responseMessage = `Товар «${prod_class} ${prod_name}» был успешно добавлен.`
                            break;
                        default:
                            responseMessage = `המוצר «${prod_class} ${prod_name}» נוסף בהצלחה.`
                    };
                    logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                    return res.json([{ status: true, message: responseMessage }]);
                }
              //-------------------------------ERRORS-------
                else {
                    switch (language) {
                        case 'en':
                            responseMessage = `Product «${prod_class} ${prod_name}» wasn't added.`
                            break;
                        case 'ru':
                            responseMessage = `Товар «${prod_class} ${prod_name}» не был добавлен.`
                            break;
                        default:
                            responseMessage = `המוצר «${prod_class} ${prod_name}» לא נוסף.`
                    };
                    logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                    return res.json([{ status: false, message: responseMessage }]);
                }
            } catch (err) {
                logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
                return res.json([{ status: false, message: err.message }]);
            }
        }
        // -------------------------------SAVING CHANGES TO PRODUCT----------
        else {
            const produstToChange = await ProductSchema.updateOne({ "prod_burcode": prod_burcode }, {
                $set: {
                    "prod_burcode": prod_burcode,
                    "prod_class": prod_class,
                    "prod_name": prod_name.toUpperCase(),
                    "extra_inf": extra_inf,
                    "quantity_options": quantity_options, 
                    "images": images, 
                    "comments": comments
                }
            });
            if (produstToChange) {
                // ----------------------depending on language -  different response:
                switch (language) {
                    case 'en':
                        responseMessage = `Changes to «${prod_class} ${prod_name}» has been saved successfully.`
                        break;
                    case 'ru':
                        responseMessage = `Изменения в «${prod_class} ${prod_name}» успешно сохранены.`
                        break;
                    default:
                        responseMessage = `שינויים ב- «${prod_class} ${prod_name}» נשמרו בהצלחה.`
                };
                logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                return res.json([{ status: true, message: responseMessage }]);
            }
            //-------------------------------ERRORS-------
            else {
                // ----------------------depending on language -  different response:
                switch (language) {
                    case 'en':
                        responseMessage = `Changes to «${prod_class} ${prod_name}» hasn't been saved. Please, try again.`
                        break;
                    case 'ru':
                        responseMessage = `Изменения в «${prod_class} ${prod_name}» не были сохранены. Пожалуйста, попробуйте еще раз.`
                        break;
                    default:
                        responseMessage = `שינויים ב- «${prod_class} ${prod_name}» לא נשמרו. בבקשה נסה שוב.`
                };
                logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
                return res.json([{ status: false, message: responseMessage }]);
            }
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});


// ------------------------------------------------------DELETE PRODUCT BY ID-------------------------------
router.get('/:lang/remove/:id', async(req, res) => {
    const _id = req.params.id;
    const language = req.params.lang;
    try {
        let thisProduct = await ProductSchema.deleteOne({ "_id": _id });
        if (thisProduct !== null) {
            // ----------------------depending on language -  different response:
            switch (language) {
                case 'en':
                    responseMessage = `Product was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Товар был удален.`
                    break;
                default:
                    responseMessage = `המוצר נמחק.`
            };
            logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Product wasn't found.`
                    break;
                case 'ru':
                    responseMessage = `Товар не найден.`
                    break;
                default:
                    responseMessage = `המוצר לא נמצא.`
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
});

// to delete this function:
router.get("/resave", async(req, res, next) => {
    const allProductes = await ProductSchema.remove();
    if(allProductes.ok===1){
   try {
        const allProductes = await oldProductSchema.find().sort({ 'prod_class': 1, 'burcode_id': 1 }); //get them sorted by name
        allProductes.forEach(element => {
        let new_element = new ProductSchema({
            prod_burcode: element.burcode_id,
            prod_class: element.prod_class,
            prod_name: element.name,
            // extra_inf: {},
            quantity_options: {
            amount_1: element.amount_1,
            price_1: element.price_1
                },
            images: {
            link_1: element.img_link_1
                },
            comments: {}
            });
            //extra
            if (element.prod_collection) { new_element.extra_inf["prod_collection"] = element.prod_collection };
            if (element.color) { new_element.extra_inf["color"] = element.color };
            if (element.tint) { new_element.extra_inf["tint"] = element.tint };
            if (element.transparency) { new_element.extra_inf["transparency"] = element.transparency };
            if (element.label) { new_element.extra_inf["label"] = element.label };
            //quantity
            if (element.amount_2) { new_element.quantity_options["amount_2"] = element.amount_2; new_element.quantity_options["price_2"] = element.price_2 };
            if (element.amount_3) { new_element.quantity_options["amount_3"] = element.amount_3; new_element.quantity_options["price_3"] = element.price_3 };
            if (element.amount_4) { new_element.quantity_options["amount_4"] = element.amount_4; new_element.quantity_options["price_4"] = element.price_4 };
            if (element.amount_5) { new_element.quantity_options["amount_5"] = element.amount_5; new_element.quantity_options["price_5"] = element.price_5 };
            if (element.amount_6) { new_element.quantity_options["amount_6"] = element.amount_6; new_element.quantity_options["price_6"] = element.price_6 };
            // images
            if (element.img_link_2) { new_element.images["link_2"] = element.img_link_2 };
            if (element.img_link_3) { new_element.images["link_3"] = element.img_link_3 };
            if (element.img_link_4) { new_element.images["link_4"] = element.img_link_4 };
            if (element.img_link_5) { new_element.images["link_5"] = element.img_link_5 };
            if (element.img_link_6) { new_element.images["link_6"] = element.img_link_6 };
            //comments
            if (element.coment_rus || element.coment_iv || element.coment_eng) { new_element.comments["coment_eng"] = element.coment_eng; new_element.comments["coment_rus"] = element.coment_rus; new_element.comments["coment_iv"] = element.coment_iv; };
        new_element.save(); 
    });
    } catch (err) {
        console.log(err);
    }
    }
 
});


module.exports = router;