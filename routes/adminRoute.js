import express from "express";

import { addDoctor, adminLogin, allDoctors } from "../controllers/adminController.js";

import upload from "../middelwares/multer.js";
import authAdmin from "../middelwares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',adminLogin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.patch('/change-availability',authAdmin,changeAvailablity)


export default adminRouter