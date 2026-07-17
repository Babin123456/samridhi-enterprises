import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const admin = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.headers.authorization) {
      token = req.headers.authorization;
    }

    if (!token || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    const isAdmin = user.role === "ADMIN" || user.role === "MANAGER";
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: admin access revoked",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default admin;