const jwt = require("jsonwebtoken");

const authJwt = (req, res, next) => {
    const token = req.headers["authorization"];
    if(!token) return res.status(403).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, "secretkey");
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authJwt;