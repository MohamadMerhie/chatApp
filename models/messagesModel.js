import mongoose, { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const MessageModel = model("Message", MessageSchema, "messages");
export default MessageModel;
