const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};


const adminOnly = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.admin = decoded;

    if (req.admin.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin access denied", success: false });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

module.exports = {
  protect,
  adminOnly,
};
