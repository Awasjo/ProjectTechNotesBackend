const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {//must match for it to be verified
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];// splitting the off header string, we get the token after the Bearer header

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { //passing the token in, verify it, if there is an error, we send the message, otherwise, we will get the decoded values. next is going to go to the controller, or the next middleware
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
