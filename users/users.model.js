const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now, required: true }
});

const UserTemplate = mongoose.model("UserTemplate", userSchema, "users");

const validateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(6).max(30).required(),
        password: Joi.string().min(8).max(200).regex(/[a-zA-Z0-9]{8,200}/).required()
    });
    return schema.validate(user);
};

module.exports = {
    UserTemplate,
    validateUser
};
