const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Headers:", req.headers);

  console.log("authHeader",authHeader)
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  
  if (!token) return res.status(403).json({ message: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};

module.exports =  verifyToken ;
