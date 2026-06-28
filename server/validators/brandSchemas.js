import { z } from "zod";
import { idParamSchema } from "./common.js";

export const addBrandSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Brand name is required"),
  }),
});

export const updateBrandSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    name: z.string().trim().min(1, "Brand name cannot be empty").optional(),
  }),
});
