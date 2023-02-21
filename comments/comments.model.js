const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    timestamp: { type: Date, default: Date.now, required: true }
});

const CommentTemplate = mongoose.model("CommentTemplate", commentSchema, "comments");

const contentSchema = Joi.string().min(5).max(200);
const emailSchema = Joi.string().email();

const validateComment = (user) => {
    const schema = Joi.object({
        content: contentSchema.required(),
        email: emailSchema.required()
    });
    return schema.validate(user);
};

module.exports = {
    CommentTemplate,
    validateComment
};
