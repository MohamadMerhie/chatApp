import User from "../models/userModel.js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_JWT = process.env.SECRET_JWT || 1234567890;

// controller für zurücksetzen des passwortes

const register = async (req, res) => {
  try {
    const newUser = req.body;
    console.log(newUser);
    const findExists = await User.findOne({ email: newUser.email });
    console.log(findExists);
    if (findExists) {
      const error = new Error("Duplicated Email");
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

    console.log("response von sendgrid", createdUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(401).send({ error: error.message });
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
    // res.send({ message: "email verifiziert" });
    res.redirect("http://localhost:3000/");
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
const verifyPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    console.log(decodedToken);
    const id = decodedToken._id;
    await User.findByIdAndUpdate(id, {
      isVerified: true,
    });
    // res.status(200).send("verified")
    res.redirect("http://localhost:3000/users/setPassword");
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
      const error = new Error("No user found");
      error.statusCode = 401;
      throw error;
    }

    const setToOnline = await User.findByIdAndUpdate(findUser.id, {
      isOnline: true,
    });
    console.log(setToOnline.password);
    console.log(userInput.password);
    const pass = userInput.password;

    const vergleich = await bcrypt.compare(pass, setToOnline.password);
    console.log(!vergleich);
    if (!vergleich) {
      const error = new Error("password wrong error");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: findUser.email,
        userId: findUser._id,
      },
      process.env.SECRET_JWT || "thisisoursecretjsonwebtoken",
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
    console.log(response.ok);
  } catch (err) {
    next(err);
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
    // console.log(users);
    res.status(200).send(users);
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
    // console.log(users);
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
    console.log("test");
    const findUser = await User.findOne({ email: email });
    console.log(findUser);
    console.log(findUser._id);
    // console.log(id);
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
    console.log(token);
    const msg = {
      to: email, // Change to your recipient
      from: "amnaelsayed2@gmail.com", // Change to your verified sender
      subject: "Reset password",
      text: `To reset you password please follow the link:http://localhost:${process.env.PORT}/users/verify/password/${token} `,
      html: `<p><a href="http://localhost:${process.env.PORT}/users/verify/password/${token}">Reset Password</a></p>`,
    };
    const response = await sgMail.send(msg);
    console.log(response);
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
      });
    console.log(einTag);
  } catch (err) {
    console.log(err);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    const { email } = req.body;
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
      {
        isOnline: false,
      },
      { new: true }
    );

    res.clearCookie("loginCookie");

    res.send({ msg: "logging you out" });
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
