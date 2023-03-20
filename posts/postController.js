const { PostTemplate } = require("./posts.model");
const { deleteLikeById } = require("../likes/likeController");

exports.createPost = async (req, res) => {
    return new PostTemplate({
        title: req.body.title,
        content: req.body.content,
        owner_id: req.decoded.userId
    })
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getPosts = (req, res) => {
    PostTemplate.find().limit(20)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getPost = async (req, res) => {
    try {
        const post = await PostTemplate.findOne({ _id: req.params.postId });
        if (!post) return res.status(400).json({ message: "Post does not exist" });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    const post = await PostTemplate.findOne({ _id: req.params.postId });
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    if (!post.owner_id.equals(req.decoded.userId)) {
        return res.status(400).json({ message: "Post can only be updated by post owner" });
    }

    try {
        const updatedPost = await PostTemplate.findByIdAndUpdate(req.params.postId, req.body);
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};

exports.deletePost = async (req, res) => {
    const post = await PostTemplate.findById(req.params.postId);
    if (!post) {
        return res.status(400).json({ message: "Post not found" });
    }

    if (!post.owner_id.equals(req.decoded.userId)) {
        return res.status(400).json({ message: "Post can only be deleted by post owner" });
    }

    // Delete likes
    if (post.likes) {
        for (const likeId of post.likes) {
            await deleteLikeById(likeId);
        }
    }

    post.deleteOne();
    res.sendStatus(200);
};

exports.getFeed = async (req, res) => {
    const limit = 5;//todo set limit
    const posts = await PostTemplate.find().sort({ "likesLength": "desc", "timestamp": "desc" }).limit(limit);
    res.status(200).json(posts);
};
