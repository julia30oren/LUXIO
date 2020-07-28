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

router.post("/save", getByBurcode, async(req, res, next) => {
    // console.log(req.body);

    try {
        let thisItem = await ProductSchema.find({ "burcode_id": req.body.burcode_id });
        if (!thisItem[0]) {

            const newProduct = new ProductSchema({
                burcode_id: req.body.burcode_id,
                prod_class: req.body.prod_class,
                name: req.body.name.toUpperCase(),
                price: req.body.price,
                img_link: req.body.img_link || 'https://sciences.ucf.edu/psychology/wp-content/uploads/sites/63/2019/09/No-Image-Available.png',
                color: req.body.color,
                tint: req.body.tint,
                transparency: req.body.transparency,
                label: req.body.label
            });
            console.log(newProduct);
            try {
                const itemToSave = await newProduct.save();
                if (itemToSave._id) {
                    res.status(200).json({ message: `Product "${itemToSave.prod_class} ${itemToSave.name}" was added successfully.` });
                    // logger.info(`${now} - New product posted "${itemToSave.name}"`);
                } else {
                    res.status(406).json({ message: ` We have an error.` });
                    // logger.error(`${now} - We have an error with posting new product`);
                }
            } catch (err) {
                logger.error(`${now} - We have an error with posting new product`);
                res.status(406).json({ message: ` We have an error with data : ${err.message}` })
            }

            // return res.status(404).send({ message: 'item not found' })
        } else {
            console.log('item already exist');
            return res.send({ message: 'item already exist' })
        }
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
    // res.json(thisItem);
});


async function getByBurcode(req, res, next) {
    let thisItem;
    try {
        thisItem = await ProductSchema.find({ "burcode_id": req.params.id });
        if (thisItem == null) {
            return res.status(404).send({ message: 'category not found' })
        }
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
    res.thisItem = thisItem;
    next();
}

module.exports = router;