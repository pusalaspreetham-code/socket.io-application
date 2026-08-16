const express=require('express');
const router=express.Router();
const {createRoom,joinRoom,getRooms,deleteroom}=require("../controller/roomController.js");
const {authMiddleware}=require("../middleware/authMiddleware.js")

router.post("/create-room",authMiddleware,createRoom);
router.post("/join-room",authMiddleware,joinRoom);
router.get("/get-rooms",authMiddleware,getRooms);
router.post("/delete-room",authMiddleware,deleteroom);
module.exports=router;