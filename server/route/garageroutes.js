import express from "express";
import auth from "../middleware/auth.js";

import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  setDefaultVehicle,
} from "../controllers/garageController.js";

const router = express.Router();

router.route("/")
  .post(auth, addVehicle)
  .get(auth, getVehicles);

router.route("/:id")
  .put(auth, updateVehicle)
  .delete(auth, deleteVehicle);

router.route("/:id/default")
  .patch(auth, setDefaultVehicle);

export default router;
