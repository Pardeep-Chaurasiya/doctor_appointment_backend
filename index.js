import cors from "cors"
import express from "express"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"

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

app.get('/', (req, res) => {
    res.send('API working')
})

app.listen(port,()=>{
    console.log(`Server started on port : ${port}`)
})
