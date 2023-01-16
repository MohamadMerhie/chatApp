import express from "express";
import {
  createChatValidator,
  validateRequest,
} from "../middlewares/validator.js";
import {
  createChat,
  userChats,
  findChat,
} from "../controller/chatController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(createChat);
router.route("/:id").get(userChats);
router.route("/find/:senderId/:receiverId").get(findChat);

export default router;
