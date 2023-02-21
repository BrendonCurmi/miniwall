const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes"
    }],
    likesLength: {
        type: Number,
        default: 0,
        required: true
    },
    timestamp: { type: Date, default: Date.now, required: true }
});

const PostTemplate = mongoose.model("PostTemplate", postSchema, "posts");

const titleSchema = Joi.string().min(5).max(30);
const contentSchema = Joi.string().min(5).max(200);
const emailSchema = Joi.string().email();

const validatePost = (user) => {
    const schema = Joi.object({
        title: titleSchema.required(),
        content: contentSchema.required(),
        email: emailSchema.required()
    });
    return schema.validate(user);
};

const validateUpdatePost = (user) => {
    const schema = Joi.object({
        title: titleSchema,
        content: contentSchema,
        email: emailSchema
    });
    return schema.validate(user);
};

module.exports = {
    PostTemplate,
    validatePost,
    validateUpdatePost
};
