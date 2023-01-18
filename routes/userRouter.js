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
import { validateRequest, userValidator } from "../middlewares/validator.js";
import  upload from '../multer/multer.js'

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:name").get(searchForNewChat);
router.route("/find/:id").get(getChats);
router.route("/verify/:token").get(verifyEmail);
router.route("/verify/password/:token").get(verifyPassword);
router.route("/login").post(login);
router.route("/update").put(auth, updateUser);
router.route("/updatePassword").put(authReset, updatePassword);
router.route("/resetPassword").post(resetPassword);
router.route("/logout").post(auth, logout);
router.route("/register").post(upload.single("file"),userValidator, validateRequest, register);

export default router;
