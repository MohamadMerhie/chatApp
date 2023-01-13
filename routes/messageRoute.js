import express from "express";
import { addMessage, getMessages } from "../controller/messageController.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(auth, addMessage);
router.route("/:chatId").get(getMessages);

export default router;
