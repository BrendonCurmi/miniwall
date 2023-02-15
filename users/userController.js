const { UserTemplate } = require("./users.model");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const user = await UserTemplate.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    res.status(200).header("Authorization", token).json({ ok: true });
};

exports.createUser = (req, res) => {
    return new UserTemplate({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password//todo implement encoding
    })
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.getUser = (req, res) => {
    UserTemplate.findOne({ username: req.params.username })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.updateUser = (req, res) => {
    UserTemplate.updateOne({ username: req.params.username }, req.body)
        .then(() => res.status(200).json({ ok: true }))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.deleteUser = async (req, res) => {
    await UserTemplate.deleteOne({ username: req.params.username });
    res.status(200).json({ ok: true });
};
