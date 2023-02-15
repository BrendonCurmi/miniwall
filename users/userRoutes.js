const express = require("express");
const router = express.Router();

const userController = require("./userController");

router.post("/signup", userController.createUser);

module.exports = router;
