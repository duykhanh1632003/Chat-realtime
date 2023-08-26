const express = require("express");
const router = express.Router();
const {
  createChat,
  findUserChats,
  findChat,
} = require("../Controllers/chatController"); // Sử dụng 'require' thay vì 'import'

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router; // Đúng cú pháp là 'module.exports'
