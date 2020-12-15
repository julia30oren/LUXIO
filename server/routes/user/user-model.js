const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        require: true
    },
    second_name: {
        type: String,
        require: true
    },
    phoneN: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String
    },
    street: {
        type: String
    },
    zip: {
        type: String
    },
    city: {
        type: String
    },
    home: {
        type: String
    },
    apartment: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    certificate_link: {
        type: String
    },
    photo_link: {
        type: String
    },
    business: {
        type: Object
    },
    status: {
        type: String,
        default: 'considered',
        require: true
    },
    cart: {
        type: Array,
        default: [],
        require: true
    },
    favorites: {
        type: Array,
        default: [],
        require: true
    },
    date: {
        type: Date,
        default: Date.now(),
        require: true
    }
});

module.exports = mongoose.model('users', UserSchema);