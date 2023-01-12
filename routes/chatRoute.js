import express from "express";
import {
  createChat,
  userChats,
  findChat,
} from "../controller/chatController.js";

const router = express.Router();

router.route("/").post(createChat);
router.route("/:senderId").get(userChats);
router.route("/find/:senderId/:receiverId").get(findChat);

export default router;
