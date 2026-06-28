import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { addToCartSchema, updateCartItemSchema, removeFromCartSchema } from "../validators/cartSchemas.js";

const cartRouter = express.Router();

cartRouter.route("/")
  .post(auth, validate(addToCartSchema), addToCart)
  .get(auth, getCart);

cartRouter.route("/:partId")
  .put(auth, validate(updateCartItemSchema), updateCartItem)
  .delete(auth, validate(removeFromCartSchema), removeFromCart);

cartRouter.route("/clear").delete(auth, clearCart);

export default cartRouter;
