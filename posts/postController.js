const { PostTemplate } = require("./posts.model");
const { UserTemplate } = require("../users/users.model");
const { deleteLikeById } = require("../likes/likeController");

exports.createPost = async (req, res) => {
    // todo either with user id or email
    const user = await UserTemplate.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }

    return new PostTemplate({
        title: req.body.title,
        content: req.body.content,
        owner_id: user._id
    })
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.getPosts = (req, res) => {
    PostTemplate.find().limit(20)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getPost = (req, res) => {
    PostTemplate.findOne({ _id: req.params.postId })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.updatePost = async (req, res) => {
    PostTemplate.updateOne({ _id: req.params.postId }, req.body)
        .then(() => res.status(200).json({ ok: true }))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.deletePost = async (req, res) => {
    const post = await PostTemplate.findById(req.params.postId);
    if (!post) {
        return res.status(400).json({ message: "Post not found" });
    }

    // Delete likes
    if (post.likes) {
        for (const likeId of post.likes) {
            deleteLikeById(likeId);
        }
    }

    post.deleteOne();
    res.status(200).json({ ok: true });
};
