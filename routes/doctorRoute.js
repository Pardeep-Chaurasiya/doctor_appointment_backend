import express from "express";

import { changeAvailablity } from "../controllers/doctorController.js";

import authAdmin from "../middelwares/authAdmin.js";

const doctorRouter = express.Router()

doctorRouter.patch('/change-availablity',authAdmin,changeAvailablity)

export default doctorRouter