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

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    res.status(200).header("Authorization", token).json({ ok: true });
};

const generateUserObj = async (body) => {
    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(body.password, salt);
    return {
        email: body.email,
        username: body.username,
        password: hashedPassword
    };
};

exports.createUser = async (req, res) => {
    return new UserTemplate(await generateUserObj(req.body))
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.getUser = (req, res) => {
    UserTemplate.findOne({ username: req.params.username })
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.updateUser = async (req, res) => {
    UserTemplate.updateOne({ username: req.params.username }, await generateUserObj(req.body))
        .then(() => res.status(200).json({ ok: true }))
        .catch(err => res.status(400).json({ message: err.message }));
};

exports.deleteUser = async (req, res) => {
    await UserTemplate.deleteOne({ username: req.params.username });
    res.status(200).json({ ok: true });
};
