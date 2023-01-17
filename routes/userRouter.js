import express from "express";
import {
  login,
  register,
  verifyEmail,
  getChats,
  getUsers,
  searchForNewChat,
  resetPassword,
  updatePassword,
  updateUser,
  logout,
  verifyPassword,
} from "../controller/userController.js";
import auth from "../middlewares/auth.js";
import authReset from "../middlewares/authReset.js";
// import validators
import { validateRequest, userValidator } from "../middlewares/validator.js";
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:name").get(searchForNewChat);
router.route("/find/:id").get(getChats);

router.route("/register").post(userValidator, validateRequest, register);
router.route("/verify/:token").get(verifyEmail);
router.route("/verify/password/:token").get(verifyPassword);
router.route("/login").post(login);
router.route("/update").put(auth, updateUser);
router.route("/resetPassword").post(resetPassword);
router.route("/logout").post(auth, logout);
router.route("/updatePassword").put(authReset, updatePassword);

export default router;
