const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    prod_burcode: {
        type: String,
        require: true
    },
    prod_class: {
        type: String,
        require: true
    },
    prod_name: {
        type: String,
        require: true
    },
    extra_inf: { //new
        type: Object,
        require: true,
        default: {}
    },
    quantity_options: { //new
        type: Object,
        require: true,
        default: {}
    },
    images: { //new
        type: Object,
        require: true,
        default: {}
    },
    comments: { //new
        type: Object,
        require: true,
        default: {}
    },
});

module.exports = mongoose.model('mitra_products', ProductSchema);