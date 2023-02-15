const express = require("express");
const router = express.Router();

const userController = require("./userController");
const validateMiddleWare = require("../middleware/validate");
const { validateUser } = require("./users.model");

router.post("/signup", [validateMiddleWare(validateUser)], userController.createUser);

module.exports = router;
