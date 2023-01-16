import express from "express";
import {
  login,
  register,
  verifyEmail,
<<<<<<< HEAD
  getChats,
  getUsers,
  searchForNewChat,
=======
  resetPassword,
  updatePassword,
  updateUser,
>>>>>>> d84207efc8bc45eef7af19a5679b0b65b33483b5
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
router.route("/resetPassword").post(resetPassword);
router.route("/updatePassword").patch(updatePassword);

export default router;
