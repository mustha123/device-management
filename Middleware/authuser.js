const jwt = require("jsonwebtoken");
const SECRET_KEY = "mernstack";

const authuser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    let token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // 🔍 ADD THIS LINE (DEBUG)
    console.log("TOKEN RECEIVED FROM HEADER:", token);

    // 🔥 ADD THIS LINE (FIX — removes quotes if present)
    token = token.replace(/^"|"$/g, "");

    const decoded = jwt.verify(token, SECRET_KEY);

    req.userId = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authuser;
