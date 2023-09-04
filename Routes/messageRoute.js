const express = require("express");
const router = express.Router();
import messageController from "../Controllers/messageController"


router.post("/", messageController.createMessage);
router.get("/:chatId", messageController.getMessage);



module.exports = router;
