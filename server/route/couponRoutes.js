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
import { validate } from "../middleware/validate.js";
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from "../validators/couponSchemas.js";
import { idParamSchema } from "../validators/common.js";

const couponRouter = express.Router();

// User: validate/apply a coupon against their own cart.
couponRouter.post("/validate", auth, validate(validateCouponSchema), validateCoupon);

// Admin: full coupon management.
couponRouter.post("/admin/create", auth, admin, validate(createCouponSchema), createCoupon);
couponRouter.get("/admin/get", auth, admin, getAllCoupons);
couponRouter.put("/admin/update/:id", auth, admin, validate(updateCouponSchema), updateCoupon);
couponRouter.delete("/admin/delete/:id", auth, admin, validate(idParamSchema), deleteCoupon);

export default couponRouter;
