const { LikeTemplate } = require("./likes.model");
const { PostTemplate } = require("../posts/posts.model");

exports.addLike = async (req, res) => {
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    if (post.owner_id.equals(req.decoded.userId)) {
        return res.status(400).json({ message: "User cannot like their own post" });
    }

    try {
        const newLike = await new LikeTemplate({
            post_id: post._id,
            owner_id: req.decoded.userId
        }).save();

        await PostTemplate.findByIdAndUpdate(req.params.postId,
            {
                $push: { likes: newLike._id },
                $inc: { "likesLength": 1 }
            },
            { new: true });

        return res.status(201).json(newLike);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.getLikes = (req, res) => {
    LikeTemplate.find().limit(20)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getLike = (req, res) => {
    LikeTemplate.findOne({ _id: req.params.likeId })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

//todo this is unneeded. to be removed
exports.updateLike = (req, res) => {
    LikeTemplate.updateOne({ _id: req.params.likeId }, req.body)
        .then(() => res.status(200).json({ ok: true }))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.deleteLike = async (req, res) => {
    const like = await LikeTemplate.findById(req.params.likeId);
    if (!like) return res.status(400).json({ message: "Like not found" });

    const post = await PostTemplate.findById(req.params.postId );
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    if (!like.owner_id.equals(req.decoded.userId)) {
        return res.status(400).json({ message: "Like can only be deleted by like owner" });
    }

    await PostTemplate.findByIdAndUpdate(req.params.postId,
        {
            $pull: { likes: like._id },
            $inc: { "likesLength": -1 }
        });

    like.deleteOne();

    res.status(200).json({ ok: true });
};

exports.deleteLikeById = (likeId) => {
    return LikeTemplate.findByIdAndDelete(likeId);
};
