const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_id: {
        type: String,
        require: true
    },
    user_name: {
        type: String,
        require: true
    },
    user_languege: {
        type: String,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('comments', CommentSchema);