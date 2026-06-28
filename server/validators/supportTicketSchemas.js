import { z } from "zod";
import { idParamSchema } from "./common.js";

const VALID_CATEGORIES = ["Order", "Payment", "Product", "Shipping", "Account", "Other"];
const VALID_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().trim().min(1, "Please enter a subject"),
    message: z.string().trim().min(1, "Please describe your issue"),
    category: z.enum(VALID_CATEGORIES, {
      errorMap: () => ({ message: "Invalid category" }),
    }).optional(),
    priority: z.enum(VALID_PRIORITIES, {
      errorMap: () => ({ message: "Invalid priority" }),
    }).optional(),
  }),
});

export const ticketMessageSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    body: z.string().trim().min(1, "Message cannot be empty"),
  }),
});

export const updateTicketStatusSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    status: z.enum(VALID_STATUSES, {
      errorMap: () => ({ message: "Invalid status" }),
    }),
  }),
});
