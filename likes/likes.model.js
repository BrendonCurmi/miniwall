const mongoose = require("mongoose");
const Joi = require("joi");

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
    timestamp: { type: Date, default: Date.now, required: true }
});

const LikeTemplate = mongoose.model("LikeTemplate", likeSchema, "likes");

module.exports = {
    LikeTemplate
};
