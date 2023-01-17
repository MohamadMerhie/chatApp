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
} from "../controller/userController.js";
import auth from "../middlewares/auth.js";
// import validators
import { validateRequest, userValidator } from "../middlewares/validator.js";
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:name").get(searchForNewChat);
router.route("/find/:id").get(getChats);

router.route("/register").post(userValidator, validateRequest, register);
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(login);
router.route("/update").put(auth, updateUser);
router.route("/resetPassword").post(auth, resetPassword);
router.route("/updatePassword").patch(auth, updatePassword);
router.route("/logout").post(auth, logout);

export default router;
