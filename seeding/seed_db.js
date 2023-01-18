import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
import { faker } from "@faker-js/faker/locale/de";
import User from "../models/userModel.js";
const URI = process.env.MONGO_DB;
mongoose
  .connect(URI)
  .then(() => console.log(`Mit MongoDB verbunden`, URI))
  .catch((err) => console.log(`Verbinden mit MongoDB fehlgeschlagen`, err));
mongoose.connection.on("error", console.log);
seed();
async function seed() {
  try {
    const fakeUser = [];
    for (let i = 0; i < 50; i++) {
      fakeUser.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(12),
        profilePicture: faker.locale.h
      });
    }
    const userPromise = User.insertMany(fakeUser);
    const values = await Promise.all([userPromise]);
    console.log("seeding complete", values);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.disconnect();
  }
}
