import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import messageRoute from "./routes/messageRoute.js";
import chatRoute from "./routes/chatRoute.js";
const MONGO_DB = process.env.MONGO_DB || "mongodb://localhost:27017";
const PORT = process.env.PORT || 4001;

mongoose
  .connect(MONGO_DB)
  .then(() => console.log("connecting with MongoDB..", MONGO_DB))
  .catch((error) => console.log("Connection with MongoDB FAILED..", error));

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use("/users", userRouter);
app.use("/chats", chatRoute);
app.use("/messages", messageRoute);

app.listen(PORT, () => {
  console.log("Listening on Port: " + PORT);
});
