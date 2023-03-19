const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 30
    },
    username: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 30
    },
    password: {
        type: String,
        required: true,
    },
    date: { type: Date, default: Date.now, required: true }
});

const UserTemplate = mongoose.model("UserTemplate", userSchema, "users");

const emailSchema = Joi.string().min(5).max(30).email();
const usernameSchema = Joi.string().min(5).max(30).regex(/[a-zA-Z0-9]/);
const passwordSchema = Joi.string().min(8).max(50).regex(/[a-zA-Z0-9]{8,50}/);

const validateUser = (user) => {
    const schema = Joi.object({
        email: emailSchema.required(),
        username: usernameSchema.required(),
        password: passwordSchema.required()
    });
    return schema.validate(user);
};

const validateUpdateUser = (user) => {
    const schema = Joi.object({
        email: emailSchema,
        username: usernameSchema,
        password: passwordSchema
    });
    return schema.validate(user);
};

const validateLogin = (user) => {
    const schema = Joi.object({
        email: emailSchema.required(),
        password: passwordSchema.required()
    });
    return schema.validate(user);
};

module.exports = {
    UserTemplate,
    validateUser,
    validateUpdateUser,
    validateLogin
};
