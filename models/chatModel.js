import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  members: { type: Array },

});

const ChatModel = new model("Chat", ChatSchema, "chats");
export default ChatModel;
