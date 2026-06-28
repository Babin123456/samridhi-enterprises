import { z } from "zod";
import { idParamSchema } from "./common.js";

export const createOrderSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(1, "fullName is required"),
    phone: z.string().trim().min(1, "phone is required"),
    addressLine: z.string().trim().min(1, "addressLine is required"),
    city: z.string().trim().min(1, "city is required"),
    state: z.string().trim().optional(),
    pincode: z.string().trim().min(1, "pincode is required"),
    upiReference: z.string().trim().optional(),
    couponCode: z.string().trim().optional(),
    paymentMethod: z.enum(["COD", "Online"], {
      errorMap: () => ({ message: "Payment method must be either COD or Online" }),
    }),
  }),
});

export const adminVerifyPaymentSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    action: z.enum(["approve", "reject"], {
      errorMap: () => ({ message: "Action must be either 'approve' or 'reject'" }),
    }),
    rejectionReason: z.string().trim().optional(),
  }),
});

export const adminUpdateOrderStatusSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    orderStatus: z.enum(["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"], {
      errorMap: () => ({
        message: "orderStatus must be one of: Confirmed, Processing, Shipped, Delivered, Cancelled",
      }),
    }),
  }),
});
