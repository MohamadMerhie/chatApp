import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/userModel.js";
const URI = process.env.MONGO_DB || "mongodb://localhost:27017";
mongoose
  .connect(URI)
  .then(() => console.log(`Mit MongoDB verbunden`, URI))
  .catch((err) => console.log(`Verbinden mit MongoDB fehlgeschlagen`, err));
mongoose.connection.on("error", console.log);
cleanDB();
async function cleanDB() {
  try {
    const userPromise = User.deleteMany({});
    const values = await Promise.all([userPromise]);
    console.log("DB cleaned", values);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
  }
}