import { Router } from "express";
import { forgotPassword, login, logout, register } from "../../controllers/user/auth.controller.js";
import { upload } from "../../middlewares/user/fileUpload.middleware.js";
import { registerValidator, validation } from "../../validators/validators.js";

export const authRouter = Router();

authRouter
  .route("/register")
  .post(upload.single("avatar"), registerValidator(), validation, register);

authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password/:token").patch(forgotPassword);