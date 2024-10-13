import express from "express";

import { getDoctorsList } from "../controllers/doctorController.js";


const doctorRouter = express.Router()

doctorRouter.get('/list',getDoctorsList)

export default doctorRouter