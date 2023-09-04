const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: mongoose.Schema.Types.String,
    senderId: mongoose.Schema.Types.String,
    text: mongoose.Schema.Types.String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
