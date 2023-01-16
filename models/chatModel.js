import mongoose, { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ChatModel = new model("Chat", ChatSchema, "chats");
export default ChatModel;
