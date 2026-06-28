import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import upload from "../middleware/multer.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelMyOrder,
  adminGetAllOrders,
  adminVerifyPayment,
  adminUpdateOrderStatus,
} from "../controllers/orderController.js";
import {
  adminGetDashboardAnalytics,
  adminGetInventoryOverview,
  adminGetSalesAnalytics,
} from "../controllers/analyticsController.js";
import { validate } from "../middleware/validate.js";
import {
  createOrderSchema,
  adminVerifyPaymentSchema,
  adminUpdateOrderStatusSchema,
} from "../validators/orderSchemas.js";
import { idParamSchema } from "../validators/common.js";

const orderRouter = express.Router();

// Customer
orderRouter.post("/new", auth, upload.single("paymentScreenshot"), validate(createOrderSchema), createOrder);
orderRouter.get("/my-orders", auth, getMyOrders);
// Customer-initiated cancellation of an own order (owner + status checked in
// the controller). Distinct method/path from the dynamic GET "/:id" below, so
// there is no route shadowing.
orderRouter.put("/:id/cancel", auth, validate(idParamSchema), cancelMyOrder);

// Admin
orderRouter.get("/admin/all", auth, admin, adminGetAllOrders);
orderRouter.put("/admin/verify/:id", auth, admin, validate(adminVerifyPaymentSchema), adminVerifyPayment);
orderRouter.put("/admin/status/:id", auth, admin, validate(adminUpdateOrderStatusSchema), adminUpdateOrderStatus);

// Admin — dashboard analytics & inventory (real data, no hardcoded values)
orderRouter.get("/admin/analytics", auth, admin, adminGetDashboardAnalytics);
orderRouter.get("/admin/inventory", auth, admin, adminGetInventoryOverview);

// Admin — chart-oriented sales analytics (monthly trends, top products,
// customer growth, recent orders) for the dedicated Sales Analytics page.
orderRouter.get(
  "/admin/sales-analytics",
  auth,
  admin,
  adminGetSalesAnalytics
);

// Keep the dynamic /:id route LAST so it does not shadow the specific routes
// above (e.g. /my-orders, /admin/all).
orderRouter.get("/:id", auth, validate(idParamSchema), getOrderById);

export default orderRouter;
