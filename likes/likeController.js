const { LikeTemplate } = require("./likes.model");
const { UserTemplate } = require("../users/users.model");
const { PostTemplate } = require("../posts/posts.model");

exports.addLike = async (req, res) => {
    const user = await UserTemplate.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    try {
        const newLike = await new LikeTemplate({
            post_id: post._id,
            owner_id: user._id
        }).save();

        await PostTemplate.findByIdAndUpdate(req.params.postId, { $push: { likes: newLike._id } }, {
            new: true
        });

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

    await PostTemplate.findByIdAndUpdate(req.params.postId, { $pull: { likes: like._id } });

    like.deleteOne();

    res.status(200).json({ ok: true });
};

exports.deleteLikeById = (likeId) => {
    return LikeTemplate.findByIdAndDelete(likeId);
};