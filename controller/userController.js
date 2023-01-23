import * as dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_JWT = process.env.SECRET_JWT || "thisisoursecretjsonwebtoken";

const register = async (req, res) => {
  try {
    const newUser = req.body;
    const profilePicture = req.file.path;
    const findExists = await User.findOne({ email: newUser.email });

    if (findExists) {
      const error = new Error("Duplicated Email");
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
      profilePicture: profilePicture,
      isOnline: false,
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const token = jwt.sign(
      {
        email: createdUser.email,
        _id: createdUser._id,
      },
      SECRET_JWT,
      {
        expiresIn: "1h",
      }
    );
    const msg = {
      to: createdUser.email, // Change to your recipient
      from: "amnaelsayed2@gmail.com", // Change to your verified sender
      subject: "Email verification",
      text: `Zur Verifizierung der email bitte zu folgender email gehen:http://localhost:${process.env.PORT}/users/verify/${token} `,
      html: `<p><a href="http://localhost:${process.env.PORT}/users/verify/${token}">Verifiziere deine Email</a></p>`,
    };

    // const token = jwt.sign(
    //   {
    //     email: createdUser.email,
    //     _id: createdUser._id,
    //   },
    //   process.env.SECRET_JWT,
    //   {
    //     expiresIn: "1h",
    //   }
    // );
    const response = await sgMail.send(msg);

    console.log("response von sendgrid", response);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, SECRET_JWT);
    const id = decodedToken._id;
    await User.findByIdAndUpdate(id, {
      isVerified: true,
    });
    res.redirect("http://localhost:3000/");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
const verifyPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, SECRET_JWT);
    const id = decodedToken._id;
    await User.findByIdAndUpdate(id, {
      isVerified: true,
    });
    res.redirect("http://localhost:3000/users/setPassword");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const userInput = req.body;
    const findUser = await User.findOne({ email: userInput.email });
    if (!findUser) {
      const error = new Error("No user found");
      error.statusCode = 401;
      throw error;
    }

    const compare = await bcrypt.compare(userInput.password, findUser.password);
    if (!compare) {
      const error = new Error("password wrong error");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: findUser.email,
        userId: findUser._id,
      },
      SECRET_JWT,
      { expiresIn: "1d" }
    );
    const einTag = 1000 * 60 * 60 * 24;
    res
      .cookie("loginCookie", token, {
        maxAge: einTag,
        httpOnly: true,
      })
      .send({
        auth: "loggedIn",
        fullName: findUser.fullName,
        _id: findUser._id,
        token: token,
      });
  } catch (err) {
    console.log({ err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      const error = new Error("no users found");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const searchForNewChat = async (req, res) => {
  const regex = new RegExp(req.params.name, "i");

  try {
    const response = await User.find().or([
      { firstName: regex },
      { lastName: regex },
    ]);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getChats = async (req, res) => {
  try {
    const users = await User.find({ _id: req.params.id });
    if (!users) {
      const error = new Error("no users found");
      error.statusCode = 401;
      throw error;
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email: email });
    const id = findUser._id.toHexString();

    await User.findByIdAndUpdate(
      id,
      { ...findUser, isVerified: false },
      { new: true }
    );
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const token = jwt.sign(
      {
        email: email,
        _id: id,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: "1h",
      }
    );
    const msg = {
      to: email, // Change to your recipient
      from: "amnaelsayed2@gmail.com", // Change to your verified sender
      subject: "Reset password",
      text: `To reset you password please follow the link:http://localhost:${process.env.PORT}/users/verify/password/${token} `,
      html: `<p><a href="http://localhost:${process.env.PORT}/users/verify/password/${token}">Reset Password</a></p>`,
    };
    const response = await sgMail.send(msg);
    const einTag = 1000 * 60 * 60 * 24;
    res
      .cookie("resetCookie", token, {
        maxAge: einTag,
        httpOnly: true,
      })
      .send({
        auth: "loggedIn",
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        password: findUser.password,
        _id: findUser._id,
        token: token,
        email: findUser.email,
        isVerified: findUser.isVerified,
        isOnline: true,
      });
    console.log(einTag);
  } catch (err) {
    console.log(err);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).send(updatedUser);
    console.log(updatedUser);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const newUser = req.body;
    const updateUser = await User.findByIdAndUpdate(id, newUser, { new: true });

    res.status(200).json(updateUser);
  } catch (error) {
    error.message = `Ein User mit der id wurde nicht gefunden! ${error.message}`;
    error.statusCode = 404;
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    const id = req.body.id;
    const updateUser = await User.findByIdAndUpdate(
      id,
      { updatedAt: Date.now() },
      { new: true }
    );

    console.log(updateUser);
    res.clearCookie("loginCookie");

    res.send(updateUser);
  } catch (error) {
    console.log({ error: error.message });
    res.json({ msg: "no user to log out!" });
  }
};

export {
  register,
  verifyEmail,
  login,
  resetPassword,
  updatePassword,
  updateUser,
  getChats,
  getUsers,
  searchForNewChat,
  logout,
  verifyPassword,
};
