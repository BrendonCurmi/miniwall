const express = require("express");
const router = express.Router();

const likeController = require("./likeController");
const validateMiddleWare = require("../middleware/validate");
const { validateLike } = require("./likes.model");

router.route("/post/:postId/like").post([validateMiddleWare(validateLike)],likeController.addLike);

router.route("/post/:postId/like/:likeId")
    .get(likeController.getLike)
    .put(likeController.updateLike)
    .delete(likeController.deleteLike);

module.exports = router;
