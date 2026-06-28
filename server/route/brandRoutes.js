import express from "express";
import upload from "../middleware/multer.js";
import {
  addBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/Admin.js";
import { validate } from "../middleware/validate.js";
import { addBrandSchema, updateBrandSchema } from "../validators/brandSchemas.js";
import { idParamSchema } from "../validators/common.js";

const brandRouter = express.Router();

brandRouter.post("/add", upload.single("image"), auth, admin, validate(addBrandSchema), addBrand);
brandRouter.get("/get", getAllBrands);
brandRouter.put("/update/:id", upload.single("image"), auth, admin, validate(updateBrandSchema), updateBrand);
brandRouter.delete("/delete/:id", auth, admin, validate(idParamSchema), deleteBrand);

export default brandRouter;
