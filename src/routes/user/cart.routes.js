import { Router } from "express";
import { isLoggedIn } from "../../middlewares/user/auth.middleware.js";
import { createCart, decreaseCartQty, getMyCart, increaseCartQty, removeItem, updateQty } from "../../controllers/user/cart.controller";

export const cartRouter = Router();

cartRouter.use(isLoggedIn);

cartRouter.route("/add").post(createCart);
cartRouter.route("/update/:id").patch(updateQty);
cartRouter.route("/increase/:id").patch(increaseCartQty);
cartRouter.route("/decrease/:id").patch(decreaseCartQty);
cartRouter.route("/remove/:id").delete(removeItem);
cartRouter.route("/my-carts").get(getMyCart);
cartRouter.route("/remove-multiple").delete();
