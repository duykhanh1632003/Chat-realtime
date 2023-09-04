const chatModel = require("../Model/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    console.log("check chat",chat)
    if (chat) return res.status(200).json({ errCode: 1 });

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error creating chat",
    });
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] }, // Chỉnh sửa $in thành $in: [userId]
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Done",
      chats,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error finding user chats",
    });
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params; // Sửa secondId thành firstId

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Done",
      chat,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error finding chat",
    });
  }
};

module.exports = {
  findChat,
  findUserChats,
  createChat,
};
