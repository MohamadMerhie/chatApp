import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: String },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = model("User", userSchema, "chatAppUsers");
export default User;
