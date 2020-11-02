const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    main_password: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        require: true
    },
    admin_password: {
        type: String,
        require: true
    },
    last_date: {
        type: Date,
        require: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('admins', AdminSchema);