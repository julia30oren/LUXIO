const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    order: {
        type: Array,
        require: true
    },
    payments: {
        type: Object,
        require: true
    },
    shipping_details: {
        type: Object,
        require: true
    },
    order_date: {
        type: Date,
        require: true,
        default: Date.now()
    },
    received: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('orders', OrderSchema);