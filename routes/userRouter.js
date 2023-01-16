import express from "express";
import {
  login,
  register,
  verifyEmail,
  resetPassword,
  updatePassword,
  updateUser,
} from "../controller/userController.js";
import auth from "../middlewares/auth.js";
// import validators
import { validateRequest, userValidator } from "../middlewares/validator.js";
const router = express.Router();

router.route("/register").post(userValidator, validateRequest, register);
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(login);
router.route("/update").put(updateUser);
router.route("/resetPassword").post(resetPassword);
router.route("/updatePassword").patch(updatePassword);

export default router;
