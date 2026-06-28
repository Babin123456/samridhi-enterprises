import { z } from "zod";
import { objectIdSchema } from "./common.js";

export const addToWishlistSchema = z.object({
  body: z.object({
    partId: objectIdSchema,
  }),
});

export const removeFromWishlistSchema = z.object({
  params: z.object({
    partId: objectIdSchema,
  }),
});
