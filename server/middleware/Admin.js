import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const admin = async (req, res, next) => {
  try {
    // Always validate against the latest user data in DB.
    // This ensures role changes take effect immediately even if the JWT was issued earlier.

    const token = req.headers.authorization?.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Re-fetch the user from DB for every admin request.
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

