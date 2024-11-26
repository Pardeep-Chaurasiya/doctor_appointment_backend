import express from "express";

import { addDoctor, adminLogin, allDoctors, appointmentCancel, appointmentsAdmin } from "../controllers/adminController.js";

import upload from "../middelwares/multer.js";
import authAdmin from "../middelwares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',adminLogin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.patch('/change-availability',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)


export default adminRouter