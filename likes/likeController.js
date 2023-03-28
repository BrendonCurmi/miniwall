const { LikeTemplate } = require("./likes.model");
const { PostTemplate } = require("../posts/posts.model");

exports.addLike = async (req, res) => {
    // Verify post and access
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    if (post.owner_id.equals(req.decoded.userId)) return res.status(400).json({ message: "User cannot like their own post" });

    // Verify if like already exists
    const like = await LikeTemplate.findOne({ post_id: post._id, owner_id: req.decoded.userId });
    if (like) return res.status(400).json({ message: "User has already liked this post" });

    try {
        const newLike = await new LikeTemplate({
            post_id: post._id,
            owner_id: req.decoded.userId,
            reaction: req.body.reaction
        }).save();

        // Add like id to post and increment likesLength
        await PostTemplate.findByIdAndUpdate(req.params.postId,
            {
                $push: { likes: newLike._id },
                $inc: { "likesLength": 1 }
            });

        return res.status(201).json(newLike);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getLike = async (req, res) => {
    try {
        // Verify like
        const like = await LikeTemplate.findById(req.params.likeId);
        if (!like) return res.status(400).json({ message: "Like does not exist" });
        res.status(200).json(like);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateLike = async (req, res) => {
    // Verify like
    const like = await LikeTemplate.findById(req.params.likeId);
    if (!like) return res.status(400).json({ message: "Like does not exist" });

    // Verify post and access
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    if (!like.owner_id.equals(req.decoded.userId)) return res.status(400).json({ message: "Like can only be updated by like owner" });

    try {
        // Update and return
        const updatedLike = await LikeTemplate.findByIdAndUpdate(req.params.likeId, req.body, { new: true });
        res.status(200).json(updatedLike);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};

exports.deleteLike = async (req, res) => {
    // Verify like
    const like = await LikeTemplate.findById(req.params.likeId);
    if (!like) return res.status(400).json({ message: "Like does not exist" });

    // Verify post and access
    const post = await PostTemplate.findById(req.params.postId);
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    if (!like.owner_id.equals(req.decoded.userId)) return res.status(400).json({ message: "Like can only be deleted by like owner" });

    // Delete like id from post and decrement likesLength
    await PostTemplate.findByIdAndUpdate(req.params.postId,
        {
            $pull: { likes: like._id },
            $inc: { "likesLength": -1 }
        });

    like.deleteOne();

    res.sendStatus(200);
};

exports.deleteLikeById = (likeId) => {
    return LikeTemplate.findByIdAndDelete(likeId);
};
