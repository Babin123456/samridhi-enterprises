// routes/bikeModelRoutes.js

import express from "express";
import upload from "../middleware/multer.js";
import {
  addBikeModel,
  getAllBikeModels,
  updateBikeModel,
  deleteBikeModel,
} from "../controllers/bikeControllers.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import { validate } from "../middleware/validate.js";
import { addBikeModelSchema, updateBikeModelSchema } from "../validators/bikeModelSchemas.js";
import { idParamSchema } from "../validators/common.js";

const bikeModelRouter = express.Router();

bikeModelRouter.post("/add", upload.single("image"), auth, admin, validate(addBikeModelSchema), addBikeModel);
bikeModelRouter.get("/get", getAllBikeModels);
bikeModelRouter.put(
  "/update/:id",
  upload.single("image"),
  auth,
  admin,
  validate(updateBikeModelSchema),
  updateBikeModel
);
bikeModelRouter.delete("/delete/:id", auth, admin, validate(idParamSchema), deleteBikeModel);

export default bikeModelRouter;
