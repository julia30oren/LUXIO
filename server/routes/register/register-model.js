const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// console.log(id, first_name, second_name, phoneN, city, email, password, category, certificate_link);

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
        type: Number,
        require: true
    },
    city: {
        type: String,
        require: true
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
    langueg: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now(),
        require: true
    }
});

module.exports = mongoose.model('users', UserSchema);