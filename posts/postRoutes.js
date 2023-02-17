const express = require("express");
const router = express.Router();

const postController = require("./postController");
const validateMiddleWare = require("../middleware/validate");
const { validatePost, validateUpdatePost } = require("./posts.model");

router.post("/", [validateMiddleWare(validatePost)], postController.createPost);

router.route("/:id")
    .get(postController.getPost)
    .put([validateMiddleWare(validateUpdatePost)], postController.updatePost)
    .delete(postController.deletePost);

module.exports = router;
