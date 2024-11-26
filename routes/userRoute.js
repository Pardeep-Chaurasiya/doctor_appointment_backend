import express from "express";

import { bookAppointment, cancleAppointment, getProfile, listAppointment, loginUser, paymentRazorPay, registerUser, updateProfile, verifyRazorPay } from "../controllers/userController.js";
import authUser from "../middelwares/authUser.js";
import upload from "../middelwares/multer.js";


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.put('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments',authUser,listAppointment)
userRouter.delete('/cancel-appointment',authUser,cancleAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorPay)
userRouter.post('/verify-razorpay',authUser,verifyRazorPay)

export default userRouter