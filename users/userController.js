const { UserTemplate } = require("./users.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

exports.login = async (req, res) => {
    const user = await UserTemplate.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const isValidPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: "Incorrect password" });
    }

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
        const user = await UserTemplate.findOne({ username: req.params.username });
        if (!user) return res.status(400).json({ message: "User does not exist" });
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await UserTemplate.findOne({ username: req.params.username });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        const updatedUser = await UserTemplate.findOneAndUpdate(
            { username: req.params.username },
            {
                $set: {
                    email: req.body.email,
                    username: req.body.username,
                    password: await hashPassword(req.body.password)
                }
            });
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const user = await UserTemplate.findOne({ username: req.params.username });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const deleted = await UserTemplate.deleteOne({ username: req.params.username });
    res.sendStatus(deleted.deletedCount === 1 ? 200 : 500);
};
