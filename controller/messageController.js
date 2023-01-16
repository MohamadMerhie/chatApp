import MessageModel from "../models/messagesModel.js";

const addMessage = async (req, res) => {
  try {
    const response = await MessageModel.create({
      chatId: req.body.chatId,
      senderId: req.body.senderId,
      text: req.body.text,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getMessages = async (req, res) => {

  try {
    const response = await MessageModel.find({ chatId: req.params.chatId });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { addMessage, getMessages };
