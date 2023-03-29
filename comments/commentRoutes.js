const express = require("express");
const router = express.Router();

const commentController = require("./commentController");
const validateMiddleWare = require("../middleware/validate");
const { validateComment } = require("./comments.model");

router.route("/post/:postId/comments").get(commentController.getCommentsFromPost);

router.route("/post/:postId/comment").post([validateMiddleWare(validateComment)], commentController.addComment);

router.route("/post/:postId/comment/:commentId")
    .get(commentController.getComment)
    .put([validateMiddleWare(validateComment)], commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;
