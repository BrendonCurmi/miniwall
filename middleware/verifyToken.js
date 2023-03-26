const jwt = require("jsonwebtoken");

// Adapted from Lab 4, Part 1: MiniFilm REST Verification and Authentication
const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization");
    if (token) {
        try {
            req.decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            next();
        } catch (ex) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = verifyToken;
