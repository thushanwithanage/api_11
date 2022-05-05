const jwt = require("jsonwebtoken");

jwtvalidator = (req, res, next) => {
    const token = req.header("x-jwt-token");
    if (!token) {
        console.log("Access token not found");
        return res.status(401).send("Access token not found");
    };

    try {
        jwt.verify(token, process.env.SECRET_KEY);
    }
    catch (e) {
        console.log("Invalid token");
        return res.status(400).send("Invalid token");
    }

    let decoded = jwt.decode(token, process.env.SECRET_KEY);
    if (!decoded.isAdmin) {
        return res.status(403).send("Access forbidden")
    }
    return next();
  };
  
module.exports = jwtvalidator