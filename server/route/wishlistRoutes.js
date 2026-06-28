import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { addToWishlistSchema, removeFromWishlistSchema } from "../validators/wishlistSchemas.js";

const wishlistRouter = express.Router();

wishlistRouter.route("/")
  .get(auth, getWishlist)
  .post(auth, validate(addToWishlistSchema), addToWishlist);

wishlistRouter.route("/:partId").delete(auth, validate(removeFromWishlistSchema), removeFromWishlist);

export default wishlistRouter;
