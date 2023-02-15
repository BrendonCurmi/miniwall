const { UserTemplate } = require("./users.model");

exports.createUser = (req, res) => {
    return new UserTemplate({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,//todo implement encoding
    })
        .save()
        .then(data => res.status(201).json(data))
        .catch(err => res.status(400).json({ message: err.message }));
};
