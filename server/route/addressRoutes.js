import express from "express";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { addAddressSchema, updateAddressSchema } from "../validators/addressSchemas.js";
import { idParamSchema } from "../validators/common.js";

const addressRouter = express.Router();

// All address routes are scoped to the logged-in user.
addressRouter.get("/my", auth, getMyAddresses);
addressRouter.post("/add", auth, validate(addAddressSchema), addAddress);
addressRouter.put("/update/:id", auth, validate(updateAddressSchema), updateAddress);
addressRouter.delete("/delete/:id", auth, validate(idParamSchema), deleteAddress);
addressRouter.put("/default/:id", auth, validate(idParamSchema), setDefaultAddress);

export default addressRouter;
