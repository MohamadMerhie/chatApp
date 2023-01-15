import express from "express";
import {
  login,
  register,
  verifyEmail,
  resetPassword,
  updatePassword,
} from "../controller/userController.js";
import auth from "../middlewares/auth.js";
// import validators
import { validateRequest, userValidator } from "../middlewares/validator.js";
const router = express.Router();

router.route("/register").post(userValidator, validateRequest, register);
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(login);
router.route("/resetPassword").post(resetPassword);
router.route("/updatePassword").post(updatePassword);

export default router;
