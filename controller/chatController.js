import ChatModel from "../models/chatModel.js";

// const createChat = async (req, res) => {
//   console.log(req.body);
//   try {


//     const chatExists = await ChatModel.find({
//       members: {
//         $all: [
//           { senderId: req.body.receiverId },
//           { receiverId: req.body.receiverId },
//         ],
//       },
//     });
//     console.log(chatExists);
//     if (await chatExists) {
//       console.log("chatExists");
//       const error = new Error("chatExists");
//       error.statusCode = 404;
//       throw error;
//     } else {
//       const response = await ChatModel.create(req.body);
//       res.status(201).json(response);
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log("chatExists");
//   }
// };
const createChat = async (req, res) => {
  try {
    const response = await ChatModel.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const userChats = async (req, res) => {
  try {
    console.log(req.params.id);
    const response = await ChatModel.find({
      members: { $in: [req.params.id] },
    });

    // console.log(response);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findChat = async (req, res) => {
  try {
    const response = await ChatModel.findOne({
      members: { $all: [req.params.senderId, req.params.receiverId] },
    });
    if (!response.ok) {
      
      res.status(201).send(response);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { createChat, userChats, findChat };
