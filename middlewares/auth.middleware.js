import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User with this token no longer exists"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const {adminToken, adminPassword, adminName} = req.body;
    
    if (!adminToken || !adminPassword || !adminName) {
      return res.status(401).json({ 
        message: "Invalid admin credentials",
      });
    }

    if (
      adminToken !== process.env.ADMIN_TOKEN ||
      adminPassword !== process.env.ADMIN_PASSWORD ||
      adminName !== process.env.ADMIN_NAME
    ) {
      return res.status(401).json({ 
        message: "Access denied. Invalid admin credentials." 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};
