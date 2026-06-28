import express from "express";
import {
  createTicket,
  getMyTickets,
  getMyTicket,
  addMessage,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  adminReply,
} from "../controllers/supportTicketController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import { validate } from "../middleware/validate.js";
import {
  createTicketSchema,
  ticketMessageSchema,
  updateTicketStatusSchema,
} from "../validators/supportTicketSchemas.js";
import { idParamSchema } from "../validators/common.js";

const supportTicketRouter = express.Router();

// ── Authenticated user routes ──
supportTicketRouter.post("/create", auth, validate(createTicketSchema), createTicket);
supportTicketRouter.get("/my", auth, getMyTickets);
supportTicketRouter.get("/my/:id", auth, validate(idParamSchema), getMyTicket);
supportTicketRouter.post("/my/:id/message", auth, validate(ticketMessageSchema), addMessage);

// ── Admin routes ──
supportTicketRouter.get("/admin/get", auth, admin, getAllTickets);
supportTicketRouter.get("/admin/:id", auth, admin, validate(idParamSchema), getTicketById);
supportTicketRouter.put("/admin/:id/status", auth, admin, validate(updateTicketStatusSchema), updateTicketStatus);
supportTicketRouter.post("/admin/:id/reply", auth, admin, validate(ticketMessageSchema), adminReply);

export default supportTicketRouter;
