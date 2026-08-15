const express=require("express");
const router=express.Router();
const {registerUser,loginUser,getMe,updatePassword}=require("../controller/authController.js")
const {authMiddleware}=require("../middleware/authMiddleware.js")

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",authMiddleware,getMe);
router.post("/update",authMiddleware,updatePassword);

module.exports=router;