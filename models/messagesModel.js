import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  chatId: { type: String },
  senderId: { type: String },
  text: { type: String },
});

const MessageModel = model("Message", MessageSchema);
export default MessageModel;
