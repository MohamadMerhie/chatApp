import User from "../models/userModel.js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_JWT = process.env.SECRET_JWT || 1234567890;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const register = async (req, res) => {
  try {
    const newUser = req.body;
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
    });

    sgMail.setApiKey(SENDGRID_API_KEY);
    const token = jwt.sign(
      {
        email: createdUser.email,
        _id: createdUser._id,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: "1h",
      }
    );
    console.log(token);
    const msg = {
      to: createdUser.email, // Change to your recipient
      from: "amnaelsayed2@gmail.com", // Change to your verified sender
      subject: "Email verification",
      text: `Zur Verifizierung der email bitte zu folgender email gehen:http://localhost:${process.env.PORT}/users/verify/${token} `,
      html: `<p><a href="http://localhost:${process.env.PORT}/users/verify/${token}">Verifiziere deine Email</a></p>`,
    };
    const response = await sgMail.send(msg);
    console.log("response von sendgrid", response);
    res.status(201).send(createdUser);
  } catch (error) {
    res.status(401).send({ error});
  }
};
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    console.log(decodedToken);
    const id = decodedToken._id;
    await User.findByIdAndUpdate(id, {
      isVerified: true,
    });
    res.send({ message: "email verifiziert" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
const login = async (req, res, next) => {
  try {
    const userInput = req.body;
    const findUser = await User.findOne({ email: userInput.email });
    if (!findUser) {
      const error = new Error("Kein User vorhanden");
      error.statusCode = 401;
      throw error;
    }
    const pass = userInput.password;
    const vergleich = await bcrypt.compare(pass, findUser.password);
    // res.send(vergleich);
    if (!vergleich) {
      const error = new Error("passwort falsch");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: findUser.email,
        userId: findUser._id,
      },
      process.env.JWT || "Geheimnis",
      { expiresIn: "1d" }
    );
    const einTag = 1000 * 60 * 60 * 24;
    res
      .cookie("loginCookie", token, {
        maxAge: einTag,
        httpOnly: true,
      })
      .send({
        auth: "eingeloggt",
        userName: findUser.firstName,
      });
  } catch (err) {
    next(err);
  }
};

export { register, verifyEmail, login };
