import { Router } from "express";
import {
  deleteProfile,
  getProfile,
  requestForDeleteProfile,
  updatePassword,
  updateProfile,
  updateProfileImage,
} from "../../controllers/user/profile.controller.js";
import { isLoggedIn } from "../../middlewares/user/auth.middleware.js";
import {
  updateProfileValidator,
  validation,
} from "../../validators/validators.js";

export const profileRouter = Router();

profileRouter.use(isLoggedIn);

profileRouter.route("/my-profile").get(getProfile);

profileRouter
  .route("/update")
  .patch(updateProfileValidator(), validation, updateProfile);

profileRouter.route("/request-delete-account").post(requestForDeleteProfile);

profileRouter.route("/delete-account/:token").delete(deleteProfile);

profileRouter.route("/update-password").patch(updatePassword);

profileRouter.route("/update-profile").patch(updateProfileImage);
