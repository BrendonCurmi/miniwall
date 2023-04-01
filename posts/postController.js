const { PostTemplate } = require("./posts.model");
const { deleteLikeById } = require("../likes/likeController");
const { deleteCommentById } = require("../comments/commentController");

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
    const limit = req.query.max || 30;
    PostTemplate.find().limit(limit)
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
        const updatedPost = await PostTemplate.findByIdAndUpdate(req.params.postId, req.body, { new: true });
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

    // Delete likes on post
    if (post.likes) {
        for (const likeId of post.likes) {
            await deleteLikeById(likeId);
        }
    }

    // Delete comments on post
    if (post.comments) {
        for (const commentId of post.comments) {
            await deleteCommentById(commentId);
        }
    }

    post.deleteOne();
    res.sendStatus(200);
};

exports.getFeed = async (req, res) => {
    // Adapted from https://www.practical-mongodb-aggregations.com/examples/joining/one-to-one-join.html
    const limit = req.query.max || 30;
    const posts = await PostTemplate.aggregate([
        // Join comments
        {
            $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: "_id",
                as: "comments"
            }
        },
        // Sort comments by their timestamp in order from oldest to newest
        {
            $set: {
                comments: {
                    $function: {
                        body: `
                            function (comments) {
                              return comments.sort(function(a, b) {
                                return a.timestamp - b.timestamp;
                              });
                            }`,
                        args: ["$comments"],
                        lang: "js"
                    }
                }
            }
        },
        // Join likes
        {
            $lookup: {
                from: "likes",
                localField: "likes",
                foreignField: "_id",
                as: "likes"
            }
        },
        // Sort by most to least likesLength and from newest to oldest timestamp
        { $sort: { "likesLength": -1, "timestamp": -1 } },
        // Limit the number of results
        { $limit: limit }
    ]);
    res.status(200).json(posts);
};
