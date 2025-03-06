import Router from "express";
import { isLoggedIn } from "../../middlewares/user/auth.middleware.js";
import { createWishlist, getMyWishlist, removeWishlistItem } from "../../controllers/user/wishlist.controller.js";

export const wishlistRouter = Router();

wishlistRouter.use(isLoggedIn);

wishlistRouter.route("/my-wishlist").get(getMyWishlist);
wishlistRouter.route("/create").post(createWishlist);
wishlistRouter.route("/remove").delete(removeWishlistItem);
