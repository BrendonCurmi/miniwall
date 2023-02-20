const express = require("express");
const router = express.Router();

const likeController = require("./likeController");

router.route("/post/:postId/like").post(likeController.addLike);

router.route("/post/:postId/like/:likeId")
    .get(likeController.getLike)
    .put(likeController.updateLike)
    .delete(likeController.deleteLike);

module.exports = router;
