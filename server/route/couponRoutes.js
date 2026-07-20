import { validateCouponAtomic } from '../controllers/couponController.js';
import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";

const couponRouter = express.Router();

// User: validate/apply a coupon against their own cart.
couponRouter.post("/validate", auth, validateCoupon);
couponRouter.post("/validate-atomic", auth, validateCouponAtomic);

// Admin: full coupon management.
couponRouter.post("/admin/create", auth, admin, createCoupon);
couponRouter.get("/admin/get", auth, admin, getAllCoupons);
couponRouter.put("/admin/update/:id", auth, admin, updateCoupon);
couponRouter.delete("/admin/delete/:id", auth, admin, deleteCoupon);

export default couponRouter;
