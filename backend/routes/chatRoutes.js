const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats } = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat); // Create or retrieve chat
router.route("/").get(protect, fetchChats);  // Fetch all chats

module.exports = router;