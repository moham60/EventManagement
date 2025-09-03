const jwt = require("jsonwebtoken");

const checkAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];


  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only!" });
    }

    req.user = user;
    next();
  });
    console.log("Verifying with:", process.env.JWT_SECRET);
};

module.exports = checkAdmin;
