const jwt = require("jsonwebtoken");

/**
 * @description middleware to check whether the request is from authourized user or not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function verification(req, res, next) {
    const authHeaders = req.headers.token;

    if (authHeaders) {
        const token = authHeaders.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) res.status(403).json("Token in not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated");
    }
}
module.exports = verification;
