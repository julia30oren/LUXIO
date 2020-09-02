const express = require('express');
const router = express.Router();
const ProductSchema = require('./product-model');


router.get('/', async(req, res) => {
    try {
        const allProductes = await ProductSchema.find();
        res.json(allProductes);
    } catch (err) {
        res.status(404).json({ message: ` We have an error on server : ${err.message}` })
    }
});

router.post("/save", async(req, res, next) => {
    // console.log(req.body);
    const newProduct = new ProductSchema({
        burcode_id: req.body.burcode_id,
        prod_class: req.body.prod_class,
        name: req.body.name.toUpperCase(),
        prod_collection: req.body.prod_collection,

        color: req.body.color,
        tint: req.body.tint,
        transparency: req.body.transparency,
        label: req.body.label,

        amount_1: req.body.amount_1,
        price_1: req.body.price_1,
        amount_2: req.body.amount_2,
        price_2: req.body.price_2,
        price: req.body.price,

        img_link_1: req.body.img_link_1 || 'https://thumbs.dreamstime.com/b/no-image-available-icon-photo-camera-flat-vector-illustration-132483141.jpg',
        img_link_2: req.body.img_link_2,
        img_link_3: req.body.img_link_3,

        coment_eng: req.body.coment_eng,
        coment_iv: req.body.coment_iv,
        coment_rus: req.body.coment_rus
    });

    try {
        let thisItem = await ProductSchema.find({ "burcode_id": req.body.burcode_id });
        if (!thisItem[0]) {
            // console.log(newProduct);
            try {
                const itemToSave = await newProduct.save();
                if (itemToSave._id) {
                    res.status(200).json({ state: 1, message: `Product "${itemToSave.prod_class} ${itemToSave.name}" was added successfully.` });
                    // logger.info(`${now} - New product posted "${itemToSave.name}"`);
                } else {
                    res.status(406).json({ message: ` We have an error.` });
                    // logger.error(`${now} - We have an error with posting new product`);
                }
            } catch (err) {
                logger.error(`${now} - We have an error with posting new product`);
                res.status(406).json({ message: ` We have an error with data : ${err.message}` })
            }
        } else {
            console.log('item already exist');
            const prodChange = await ProductSchema.update({ "burcode_id": req.body.burcode_id }, {
                $set: {
                    "prod_class": req.body.prod_class,
                    "name": req.body.name.toUpperCase(),
                    "prod_collection": req.body.prod_collection,

                    "amount_1": req.body.amount_1,
                    "price_1": req.body.price_1,
                    "amount_2": req.body.amount_2,
                    "price_2": req.body.price_2,

                    "color": req.body.color,
                    "tint": req.body.tint,
                    "transparency": req.body.transparency,
                    "label": req.body.label,

                    "img_link_1": req.body.img_link_1,
                    "img_link_2": req.body.img_link_2,
                    "img_link_3": req.body.img_link_3,

                    "coment_eng": req.body.coment_eng,
                    "coment_iv": req.body.coment_iv,
                    "coment_rus": req.body.coment_rus
                }
            });
            return res.send({ state: 2, message: 'Item already exist. Changes has been saved successfully.' })
        }
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
    // res.json(thisItem);
});

router.get('/remove/:id', async(req, res) => {
    // console.log(req.params.id)
    try {
        let thisProduct = await ProductSchema.remove({ "_id": req.params.id })
        if (thisProduct == null) {
            return res.status(404).send({ message: 'prod not found' })
        } else {
            return res.send({ message: 'prod deleted' })
        }
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
});

module.exports = router;