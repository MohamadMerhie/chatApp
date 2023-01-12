import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  members: { type: Array },
  //   members: {
  //     senderId: { type: String },
  //     receiverId: { type: String },
  //   },
});

const ChatModel = new model("Chat", ChatSchema, "chats");
export default ChatModel;
