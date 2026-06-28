import { z } from "zod";
import { idParamSchema } from "./common.js";

const arrayCoerce = z.preprocess((val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return val.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [val];
}, z.array(z.string()));

const booleanCoerce = z.preprocess((val) => {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return undefined;
}, z.boolean().optional());

const priceCoerce = z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().positive("Price must be a positive number"));
const stockCoerce = z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().int().nonnegative("Stock must be a non-negative integer"));

export const addPartSchema = z.object({
  body: z.object({
    product_id: z.string().trim().min(1, "Product ID is required"),
    name: z.string().trim().min(1, "Part name is required"),
    description: z.string().trim().min(1, "Description is required"),
    price: priceCoerce,
    stock: stockCoerce,
    category: z.string().trim().min(1, "Category is required"),
    vehicleCompatibility: arrayCoerce,
    bestseller: booleanCoerce,
  }),
});

export const updatePartSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    product_id: z.string().trim().min(1, "Product ID cannot be empty").optional(),
    name: z.string().trim().min(1, "Part name cannot be empty").optional(),
    description: z.string().trim().min(1, "Description cannot be empty").optional(),
    price: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().positive("Price must be a positive number").optional()),
    stock: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().nonnegative("Stock must be a non-negative integer").optional()),
    category: z.string().trim().min(1, "Category cannot be empty").optional(),
    vehicleCompatibility: arrayCoerce.optional(),
    bestseller: booleanCoerce,
  }),
});

export const reviewSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    rating: z.preprocess((val) => Number(val), z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5")),
    comment: z.string().trim().optional(),
  }),
});
