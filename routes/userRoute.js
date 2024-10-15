import express from "express";

import { getProfile, loginUser, registerUser, updateProfile } from "../controllers/userController.js";
import authUser from "../middelwares/authUser.js";
import upload from "../middelwares/multer.js";


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.put('/update-profile',upload.single('image'),authUser,updateProfile)

export default userRouter