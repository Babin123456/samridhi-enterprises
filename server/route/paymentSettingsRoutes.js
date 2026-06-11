import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import upload from "../middleware/multer.js";
import {
  getPaymentSettings,
  adminUpdatePaymentSettings,
} from "../controllers/paymentSettingsController.js";

const paymentSettingsRouter = express.Router();

paymentSettingsRouter.get("/", auth, getPaymentSettings);
paymentSettingsRouter.put(
  "/admin/update",
  auth,
  admin,
  upload.single("qrImage"),
  adminUpdatePaymentSettings
);

export default paymentSettingsRouter;
