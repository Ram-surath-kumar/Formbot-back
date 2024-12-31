const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access!" });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.log("error retrieving token data", error);
    return res.status(401).json({ error: true, message: "Invalid token" });
  }
};

module.exports = validateToken;
