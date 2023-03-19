const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        min: 5,
        max: 200
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

const validateComment = (user) => {
    const schema = Joi.object({
        content: Joi.string().min(5).max(200).required()
    });
    return schema.validate(user);
};

module.exports = {
    CommentTemplate,
    validateComment
};
