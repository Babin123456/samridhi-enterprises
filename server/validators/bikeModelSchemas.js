import { z } from "zod";
import { idParamSchema } from "./common.js";

const yearCoerce = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}, z.number().nullable().optional());

export const addBikeModelSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    brand: z.string().trim().min(1, "Brand is required"),
    engineType: z.string().trim().optional(),
    yearStart: yearCoerce,
    yearEnd: yearCoerce,
  }).refine((data) => {
    if (data.yearStart !== null && data.yearStart !== undefined &&
        data.yearEnd !== null && data.yearEnd !== undefined) {
      return data.yearStart <= data.yearEnd;
    }
    return true;
  }, {
    message: "Start year cannot be later than end year",
    path: ["yearStart"],
  }),
});

export const updateBikeModelSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    brand: z.string().trim().min(1, "Brand cannot be empty").optional(),
    engineType: z.string().trim().optional(),
    yearStart: yearCoerce,
    yearEnd: yearCoerce,
  }).refine((data) => {
    if (data.yearStart !== null && data.yearStart !== undefined &&
        data.yearEnd !== null && data.yearEnd !== undefined) {
      return data.yearStart <= data.yearEnd;
    }
    return true;
  }, {
    message: "Start year cannot be later than end year",
    path: ["yearStart"],
  }),
});
