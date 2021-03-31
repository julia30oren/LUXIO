const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    burcode_id: {
        type: String,
        require: true
    },
    prod_class: {
        type: String,
        require: true
    },
    prod_collection: {
        type: String
    },
    name: {
        type: String,
        require: true
    },
    amount_1: {
        type: String,
        require: true
    },
    price_1: {
        type: Number,
        required: true
    },
    amount_2: {
        type: String
    },
    price_2: {
        type: Number
    },
    amount_3: {
        type: String
    },
    price_3: {
        type: Number
    },
    amount_4: {
        type: String
    },
    price_4: {
        type: Number
    },
    amount_5: {
        type: String
    },
    price_5: {
        type: Number
    },
    amount_6: {
        type: String
    },
    price_6: {
        type: Number
    },
    img_link_1: {
        type: String,
        require: true
    },
    img_link_2: {
        type: String
    },
    img_link_3: {
        type: String
    },
    img_link_4: {
        type: String
    },
    img_link_5: {
        type: String
    },
    img_link_6: {
        type: String
    },

    color: {
        type: String
    },
    tint: {
        type: String
    },
    transparency: {
        type: String
    },
    label: {
        type: String
    },
    coment_eng: {
        type: String
    },
    coment_iv: {
        type: String
    },
    coment_rus: {
        type: String
    }
});

module.exports = mongoose.model('products', ProductSchema);