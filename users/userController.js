const { UserTemplate } = require("./users.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

exports.login = async (req, res) => {
    // Verify user
    const user = await UserTemplate.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // Verify password
    const isValidPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    res.header("Authorization", token).sendStatus(200);
};

const hashPassword = async (password) => {
    if (!password) return;
    const salt = await bcryptjs.genSalt(5);
    return await bcryptjs.hash(password, salt);
};

exports.createUser = async (req, res) => {
    return new UserTemplate({
        email: req.body.email,
        username: req.body.username,
        password: await hashPassword(req.body.password)
    })
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.getUser = async (req, res) => {
    try {
        // Verify user access
        const user = await UserTemplate.findOne({ username: req.params.username });
        if (!user) return res.status(400).json({ message: "User does not exist" });
        if (!user._id.equals(req.decoded.userId)) return res.status(400).json({ message: "Cannot view other users" });
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Verify user access
        const user = await UserTemplate.findOne({ username: req.params.username });
        if (!user) return res.status(400).json({ message: "User does not exist" });
        if (!user._id.equals(req.decoded.userId)) return res.status(400).json({ message: "Cannot update other users" });

        // Update and return
        const updatedUser = await UserTemplate.findOneAndUpdate(
            { username: req.params.username },
            {
                $set: {
                    email: req.body.email,
                    username: req.body.username,
                    password: await hashPassword(req.body.password)
                }
            }, { new: true });
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    // Verify user access
    const user = await UserTemplate.findOne({ username: req.params.username });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    if (!user._id.equals(req.decoded.userId)) return res.status(400).json({ message: "Cannot delete other users" });

    // Delete and verify deletion
    const deleted = await UserTemplate.deleteOne({ username: req.params.username });
    res.sendStatus(deleted.deletedCount === 1 ? 200 : 500);
};
