const { CommentTemplate } = require("./comments.model");
const { UserTemplate } = require("../users/users.model");
const { PostTemplate } = require("../posts/posts.model");

exports.addComment = async (req, res) => {
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    try {
        const newComment = await new CommentTemplate({
            content: req.body.content,
            post_id: post._id,
            owner_id: req.decoded.userId
        }).save();

        await PostTemplate.findByIdAndUpdate(req.params.postId,
            {
                $push: { comments: newComment._id }
            },
            { new: true });

        return res.status(201).json(newComment);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.getCommentsFromPost = async (req, res) => {
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    CommentTemplate.find({ post_id: post._id }).limit(20)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getComment = (req, res) => {
    CommentTemplate.findOne({ _id: req.params.commentId })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.updateComment = (req, res) => {
    CommentTemplate.updateOne({ _id: req.params.commentId }, req.body)
        .then(() => res.status(200).json({ ok: true }))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.deleteComment = async (req, res) => {
    const like = await CommentTemplate.findById(req.params.commentId);
    if (!like) return res.status(400).json({ message: "Like not found" });

    const post = await PostTemplate.findById(req.params.postId );
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    await PostTemplate.findByIdAndUpdate(req.params.postId,
        {
            $pull: { comments: like._id }
        });

    like.deleteOne();

    res.status(200).json({ ok: true });
};

exports.deleteCommentById = (commentId) => {
    return CommentTemplate.findByIdAndDelete(commentId);
};
