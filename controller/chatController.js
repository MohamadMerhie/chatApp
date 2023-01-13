import ChatModel from "../models/chatModel.js";

// const createChat = async (req, res) => {
//   try {
//     const response = await ChatModel.create({
//       members: [req.body.members.senderId, req.body.members.receiverId],
//     });
//     res.status(201).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
const createChat = async (req, res) => {
  try {
    const receiverId = req.body.receiverId;

    const response = await ChatModel.create({
      ...req.body,
      members: [req.user._id, receiverId],
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const userChats = async (req, res) => {
  try {
    const response = await ChatModel.find({
      members: { $in: [req.params.senderId] },
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  try {
    const response = await ChatModel.findOne({
      members: { $all: [req.params.senderId, req.params.receiverId] },
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { createChat, userChats, findChat };
