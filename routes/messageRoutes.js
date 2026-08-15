const express=require("express");
const router=express.Router();
const {authMiddleware}=require("../middleware/authMiddleware.js")

const {sendMessage,getAllMessages}=require("../controller/messageController.js")

router.post("/:roomId/messages",authMiddleware,sendMessage);
router.get("/:roomId/messages",authMiddleware,getAllMessages);
module.exports=router;