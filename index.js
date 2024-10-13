import cors from "cors"
import express from "express"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from "./routes/userRoute.js"

// app config 
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middelwares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API endpoint
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/', (req, res) => {
    res.send('API working')
})

app.listen(port,()=>{
    console.log(`Server started on port : ${port}`)
})
