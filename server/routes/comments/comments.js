const express = require('express');
const router = express.Router();
const CommentSchema = require('./comments-model');
// need to be done ------------- soon-----------------------
// create          logger.error(``)         and          logger.info(``)
// edd .status( )
let responseMessage;


// ---------------------------------------------------GET ALL COMMENTS-----------------------------
router.get("/", async(req, res) => {
    try {
        const allComments = await CommentSchema.find();
        res.json([{ status: true, allComments }]);
    } catch (err) {
        res.json([{ status: false, massage: err.message }]);
        // logger.error(``);
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
            }
            res.json([{ status: true, message: responseMessage }]);
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
            }
            res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        res.json([{ status: false, message: err.message }]);
        // logger.error(``);
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
            switch (language) {
                case 'en':
                    responseMessage = `Comment was deleted.`
                    break;
                case 'ru':
                    responseMessage = `Комментарий удален.`
                    break;
                default:
                    responseMessage = `התגובה נמחקה.`
            }
            res.json([{ status: true, message: responseMessage }]);
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
            }
            return res.json([{ status: false, message: responseMessage }]);
            // logger.error(``);
        }
    } catch (err) {
        return res.json([{ status: false, message: err.message }]);
        // logger.error(``);
    }
})


module.exports = router;