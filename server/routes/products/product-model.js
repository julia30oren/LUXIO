const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    burcode_id: {
        type: Number,
        require: true
    },
    prod_class: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    img_link: {
        type: String,
        require: true
    },
    color: {
        _eng: {
            type: String
        },
        _iv: {
            type: String
        },
        _rus: {
            type: String
        }
    },
    tint: {
        _eng: {
            type: String
        },
        _iv: {
            type: String
        },
        _rus: {
            type: String
        }
    },
    transparency: {
        _eng: {
            type: String
        },
        _iv: {
            type: String
        },
        _rus: {
            type: String
        }
    },
    label: {
        _eng: {
            type: String
        },
        _iv: {
            type: String
        },
        _rus: {
            type: String
        }
    }
});



module.exports = mongoose.model('products', ProductSchema);