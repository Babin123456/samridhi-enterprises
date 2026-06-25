import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import auth from "../middleware/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.route("/").get(auth, getWishlist).post(auth, addToWishlist);
wishlistRouter.route("/:partId").delete(auth, removeFromWishlist);

export default wishlistRouter;
