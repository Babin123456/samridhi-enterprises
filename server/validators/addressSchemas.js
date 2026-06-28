import { z } from "zod";
import { idParamSchema } from "./common.js";

export const addAddressSchema = z.object({
  body: z.object({
    label: z.string().trim().optional(),
    fullName: z.string().trim().min(1, "fullName is required"),
    phone: z.string().trim().min(1, "phone is required"),
    addressLine: z.string().trim().min(1, "addressLine is required"),
    city: z.string().trim().min(1, "city is required"),
    state: z.string().trim().optional(),
    pincode: z.string().trim().min(1, "pincode is required"),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    label: z.string().trim().optional(),
    fullName: z.string().trim().min(1, "fullName cannot be empty").optional(),
    phone: z.string().trim().min(1, "phone cannot be empty").optional(),
    addressLine: z.string().trim().min(1, "addressLine cannot be empty").optional(),
    city: z.string().trim().min(1, "city cannot be empty").optional(),
    state: z.string().trim().optional(),
    pincode: z.string().trim().min(1, "pincode cannot be empty").optional(),
    isDefault: z.boolean().optional(),
  }),
});
