const express = require('express');
const router = express.Router();
const CommentSchema = require('./comments-model');
const logger = require('../../logger');
const moment = require("moment");

let responseMessage;

// ---------------------------------------------------GET ALL COMMENTS-----------------------------
router.get("/", async(req, res) => {
            try {
                const allComments = await CommentSchema.find();
                return res.json([{ status: true, allComments }]);
            } catch (err) {
                logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
                return res.json([{ status: false, message: err.message }]);
    }
})

// -----------------------------------------------------SAVE NEW COMMENT---------------------------------
// ---------------------------------------------------------------------can be done only by user-------------------------
router.post("/:lang/save", async(req, res) => {
    const language = req.params.lang;
    const { comment, user_id, user_name } = req.body;
    // creating new comment-----------------------
    const newComment = new CommentSchema({
        comment: comment,
        user_id: user_id,
        user_name: user_name,
        user_languege: language
    });
    // ------------------------------------------SAVING------------------
    try {
        const Comment_saved = await newComment.save();
        if (Comment_saved) {
            // ----------------------depending on language , user will get different response:
            switch (language) {
                case 'en':
                    responseMessage = `Thank You for your comment. It has been saved successfully.`
                    break;
                case 'ru':
                    responseMessage = `Спасибо за ваш комментарий. Он был успешно сохранен.`
                    break;
                default:
                    responseMessage = `תודה לך על תגובתך. הוא נשמר בהצלחה.`
            };
            logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: true, message: responseMessage }]);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Your comment hasn't been saved. Please, try again.`
                    break;
                case 'ru':
                    responseMessage = `Ваш комментарий не был сохранен. Пожалуйста, попробуйте еще раз.`
                    break;
                default:
                    responseMessage = `התגובה שלך לא נשמרה. בבקשה נסה שוב.`
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
})

// ---------------------------------------------------------------DELETE COMMENT BY ID-------------------------------------
// -----------------------------------------------------------------------------------can be done only by admin--------
router.get("/:lang/remove/:id", async(req, res) => {
    const language = req.params.lang;
    const commentID = req.params.id;
    try {
        // -------------------------------------DELETING--------------------------
        let comment_toDelete = await CommentSchema.findByIdAndRemove({ "_id": commentID });
        if (comment_toDelete !== null) {
            const allComments = await CommentSchema.find();
            switch (language) {
                
                case 'en':
                    responseMessage = `Comment was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Комментарий удален.`
                    break;
                default:
                    responseMessage = `התגובה נמחקה.`
            };
            logger.info(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: true, message: responseMessage, newComments: allComments }]);
        }
        // -------------------------ERRORS--------------
        else {
            switch (language) {
                case 'en':
                    responseMessage = `Comment wasn't found.`
                    break;
                case 'ru':
                    responseMessage = `Комментарий не найден.`
                    break;
                default:
                    responseMessage = `התגובה לא נמצאה.`
            };
            logger.error(`${moment().format(`h:mm:ss a`)} - ${responseMessage}`);
            return res.json([{ status: false, message: responseMessage }]);
        }
    } catch (err) {
        logger.error(`${moment().format(`h:mm:ss a`)} - ${err.message}`);
        return res.json([{ status: false, message: err.message }]);
    }
})


module.exports = router;