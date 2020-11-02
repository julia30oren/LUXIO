const express = require('express');
const router = express.Router();
const ProductSchema = require('./product-model');
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
let responseMessage;


// ---------------------------------------------------GET ALL PRODUCTS-----------------------------
router.get('/', async(req, res) => {
    try {
        const allProductes = await ProductSchema.find().sort({ 'prod_class': -1 }); //get them sorted by name
        res.json([{ status: true, allProductes }]);
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


// ------------------------------------------------------SAVE NEW PRODUCT OR CHANGE OLD ONE-------------------------------
router.post("/:lang/save", async(req, res, next) => {
    const language = req.params.lang;
    const { burcode_id, prod_class, name, prod_collection, color, tint, transparency, label, amount_1, price_1, amount_2, price_2, price, img_link_1, img_link_2, img_link_3, coment_eng, coment_iv, coment_rus } = req.body;
    // creating new product-----------------------
    try {
        // ---------------------------------------------------CHECK if item already exist BY BURCODE--------
        let thisItem = await ProductSchema.findOne({ "burcode_id": burcode_id });
        // ----------------------------IF NOT we are creating new:
        if (!thisItem) {
            const newProduct = new ProductSchema({
                burcode_id: burcode_id,
                prod_class: prod_class,
                name: name.toUpperCase(),
                prod_collection: prod_collection,
                color: color,
                tint: tint,
                transparency: transparency,
                label: label,
                amount_1: amount_1,
                price_1: price_1,
                amount_2: amount_2,
                price_2: price_2,
                price: price,
                img_link_1: img_link_1,
                img_link_2: img_link_2,
                img_link_3: img_link_3,
                coment_eng: coment_eng,
                coment_iv: coment_iv,
                coment_rus: coment_rus
            });
            // ---------------------------SAVING NEW---------------------
            try {
                const itemToSave = await newProduct.save();
                if (itemToSave._id) {
                    // ----------------------depending on language -  different response:
                    switch (language) {
                        case 'en':
                            responseMessage = `Product <<${prod_class} ${name}>> was added successfully.`
                            break;
                        case 'ru':
                            responseMessage = `Товар <<${prod_class} ${name}>> был успешно добавлен.`
                            break;
                        default:
                            responseMessage = `המוצר <<${prod_class} ${name}>> נוסף בהצלחה.`
                    }
                    res.json([{ state: true, message: responseMessage }]);
                    // logger.info(``);
                }
                //-------------------------------ERRORS-------
                else {
                    switch (language) {
                        case 'en':
                            responseMessage = `Product <<${prod_class} ${name}>> wasn't added.`
                            break;
                        case 'ru':
                            responseMessage = `Товар <<${prod_class} ${name}>> не был добавлен.`
                            break;
                        default:
                            responseMessage = `המוצר <<${prod_class} ${name}>> לא נוסף.`
                    }
                    res.json([{ state: false, message: responseMessage }]);
                    // logger.error(``);
                }
            } catch (err) {
                res.json([{ state: false, message: err.message }]);
                // logger.error(``);
            }
        }
        // -------------------------------SAVING CHANGES TO PRODUCT----------
        else {
            const produstToChange = await ProductSchema.updateOne({ "burcode_id": burcode_id }, {
                $set: {
                    "prod_class": prod_class,
                    "name": name.toUpperCase(),
                    "prod_collection": prod_collection,
                    "amount_1": amount_1,
                    "price_1": price_1,
                    "amount_2": amount_2,
                    "price_2": price_2,
                    "color": color,
                    "tint": tint,
                    "transparency": transparency,
                    "label": label,
                    "img_link_1": img_link_1,
                    "img_link_2": img_link_2,
                    "img_link_3": img_link_3,
                    "coment_eng": coment_eng,
                    "coment_iv": coment_iv,
                    "coment_rus": coment_rus
                }
            });
            if (produstToChange) {
                // ----------------------depending on language -  different response:
                switch (language) {
                    case 'en':
                        responseMessage = `Changes to <<${prod_class} ${name}>> has been saved successfully.`
                        break;
                    case 'ru':
                        responseMessage = `Изменения в <<${prod_class} ${name}>> успешно сохранены.`
                        break;
                    default:
                        responseMessage = `שינויים ב- <<${prod_class} ${name}>> נשמרו בהצלחה.`
                }
                return res.json([{ state: true, message: responseMessage }]);
                // logger.info(``);
            }
            //-------------------------------ERRORS-------
            else {
                // ----------------------depending on language -  different response:
                switch (language) {
                    case 'en':
                        responseMessage = `Changes to <<${prod_class} ${name}>> hasn't been saved. Please, try again.`
                        break;
                    case 'ru':
                        responseMessage = `Изменения в <<${prod_class} ${name}>> не были сохранены. Пожалуйста, попробуйте еще раз.`
                        break;
                    default:
                        responseMessage = `שינויים ב- <<${prod_class} ${name}>> לא נשמרו. בבקשה נסה שוב.`
                }
                return res.json([{ state: false, message: responseMessage }]);
                // logger.error(``);
            }
        }
    } catch (err) {
        return res.json([{ state: false, message: err.message }]);
        // logger.error(``);
    }
});


// ------------------------------------------------------DELETE PRODUCT BY ID-------------------------------
router.get('/:lang/remove/:id', async(req, res) => {
    const id = req.params.id;
    const language = req.params.lang;
    try {
        let thisProduct = await ProductSchema.remove({ "_id": id });
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
            }
            return res.json([{ status: true, massage: responseMessage }]);
            // logger.info(``);
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
            }
            return res.json([{ status: false, massage: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
});


module.exports = router;