const jwt = require("jsonwebtoken");

function userAuth(req, res, next) {
  try {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        details: "Invalid Bearer token",
      });
    }

    let token = authHeader.split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      req.userId = decoded.userId;
      req.email = decoded.email;
      next();
    } else {
      return res.json({ details: "Invalid User" });
    }
  } catch (err) {
    console.log(err);
    res.json({ details: "Invalid Token" });
  }
}

module.exports = {
  userAuth,
};
