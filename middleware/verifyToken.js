const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization");
    if (token) {
        try {
            req.user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            next();
        } catch (ex) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = verifyToken;
