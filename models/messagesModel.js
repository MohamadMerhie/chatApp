import mongoose, { Schema, model } from "mongoose";

// const MessageSchema = new Schema({
//   chatId: { type: String },
//   senderId: { type: String },
//   text: { type: String },
// });
const MessageSchema = new Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const MessageModel = model("Message", MessageSchema);
export default MessageModel;
