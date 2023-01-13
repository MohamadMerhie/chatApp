import express from "express";
import {
  createChat,
  userChats,
  findChat,
} from "../controller/chatController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(auth, createChat);
router.route("/:senderId").get(userChats);
router.route("/find/:senderId/:receiverId").get(findChat);

export default router;
