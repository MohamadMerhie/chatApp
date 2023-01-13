import MessageModel from "../models/messagesModel.js";

const addMessage = async (req, res) => {
  try {
    const response = await MessageModel.create({
      chatId: req.body.chatId,
      senderId: req.user._id,
      text: req.body.text,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const response = await MessageModel.find({ chatId });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { addMessage, getMessages };
