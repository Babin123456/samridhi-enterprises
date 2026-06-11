import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import upload from "../middleware/multer.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  adminGetAllOrders,
  adminVerifyPayment,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Customer
orderRouter.post("/new", auth, upload.single("paymentScreenshot"), createOrder);
orderRouter.get("/my-orders", auth, getMyOrders);

// Admin
orderRouter.get("/admin/all", auth, admin, adminGetAllOrders);
orderRouter.put("/admin/verify/:id", auth, admin, adminVerifyPayment);

// Keep the dynamic /:id route LAST so it does not shadow the specific routes
// above (e.g. /my-orders, /admin/all).
orderRouter.get("/:id", auth, getOrderById);

export default orderRouter;
