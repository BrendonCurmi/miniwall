const mongoose = require("mongoose");
const Joi = require("joi");

const reactionTypes = ["like", "laugh", "crying", "heart"];

const likeSchema = new mongoose.Schema({
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
    reaction: {
        type: String,
        enum: reactionTypes,
        default: "like",
        required: true
    },
    timestamp: { type: Date, default: Date.now, required: true }
});

const LikeTemplate = mongoose.model("LikeTemplate", likeSchema, "likes");

const validateLike = (user) => {
    const schema = Joi.object({
        reaction: Joi.string().valid(...reactionTypes).required(),
    });
    return schema.validate(user);
};

module.exports = {
    LikeTemplate,
    validateLike
};
