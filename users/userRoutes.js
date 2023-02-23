const express = require("express");
const router = express.Router();

const userController = require("./userController");
const validateMiddleWare = require("../middleware/validate");
const { validateUpdateUser } = require("./users.model");

router.route("/:username")
    .get(userController.getUser)
    .put(validateMiddleWare(validateUpdateUser), userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
