const express = require("express");
const router = express.Router();

const userController = require("./userController");
const validateMiddleWare = require("../middleware/validate");
const { validateUser, validateLogin } = require("./users.model");

router.post("/signup", [validateMiddleWare(validateUser)], userController.createUser);

router.post("/login", [validateMiddleWare(validateLogin)], userController.login);

module.exports = router;
