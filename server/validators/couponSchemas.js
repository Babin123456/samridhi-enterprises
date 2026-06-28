import { z } from "zod";
import { idParamSchema } from "./common.js";

const couponBodySchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  description: z.string().trim().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    errorMap: () => ({ message: "Discount type must be either PERCENTAGE or FIXED" }),
  }),
  discountValue: z.number().nonnegative("Discount value must be a non-negative number"),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().nonnegative().optional(),
  expiresAt: z.preprocess((val) => (val ? new Date(val) : null), z.date().nullable().optional()),
  usageLimit: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "A percentage discount cannot exceed 100",
  path: ["discountValue"],
});

export const createCouponSchema = z.object({
  body: couponBodySchema,
});

export const updateCouponSchema = z.object({
  params: idParamSchema.shape.params,
  body: couponBodySchema.partial().refine((data) => {
    // If both are provided, enforce percentage cap.
    // If only one is provided, the controller handles checking against database values.
    if (data.discountType === "PERCENTAGE" && data.discountValue !== undefined && data.discountValue > 100) {
      return false;
    }
    return true;
  }, {
    message: "A percentage discount cannot exceed 100",
    path: ["discountValue"],
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, "Please enter a coupon code"),
  }),
});
