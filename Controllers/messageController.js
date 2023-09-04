const messageModel = require("../Model/messageModel");

//creating message

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const response = await message.save();
    res.status(200).json({
      errCode: 0,
      errMessage: "done",
      response,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error finding user chats",
    });
  }
};

//getMessage
const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await messageModel.find({ chatId });
    res.status(200).json({
      errCode: 0,
      message,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error finding user chats",
    });
  }
};

module.exports = {
  createMessage,
  getMessage,
};
