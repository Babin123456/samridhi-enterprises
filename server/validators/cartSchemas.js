import { z } from "zod";
import { objectIdSchema } from "./common.js";

export const addToCartSchema = z.object({
  body: z.object({
    partId: objectIdSchema,
    quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1"),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    partId: objectIdSchema,
  }),
  body: z.object({
    quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1"),
  }),
});

export const removeFromCartSchema = z.object({
  params: z.object({
    partId: objectIdSchema,
  }),
});
