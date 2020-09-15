const express = require('express');
const router = express.Router();
const CommentSchema = require('./comments-model');


router.get("/get", async(req, res) => {
    try {
        const allComments = await CommentSchema.find();
        res.json(allComments);
    } catch (err) {
        res.status(404).json({ message: ` We have an error on server : ${err.message}` })
    }
})

router.post("/save", async(req, res) => {
    const newComment = new CommentSchema({
        comment: req.body.comment,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        user_languege: req.body.user_languege
    });
    console.log(newComment);
    try {
        const Comment_saved = await newComment.save();
        res.json({ message: `all done` })
    } catch (err) {
        res.status(406).json({ message: ` We have an error with data : ${err.message}` })
    }
})

module.exports = router;