import { Router } from "express";
import { isLoggedIn } from "../../middlewares/user/auth.middleware.js";
import { upload } from "../../middlewares/user/fileUpload.middleware.js";
import { createNewDesign, deleteCard, getMyCard, updateCard } from "../../controllers/user/card.controller";

export const cardRouter = Router();

cardRouter.use(isLoggedIn);

cardRouter.route("/save").post(upload.single("image"), createNewDesign);
cardRouter.route("/delete/:id").delete(deleteCard);
cardRouter.route("/my-cards").get(getMyCard);
cardRouter.route("/update/:id").patch(updateCard);