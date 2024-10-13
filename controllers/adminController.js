import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"

// API for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      speciality,
      degree,
      about,
      fees,
      experience,
    } = req.body;
    const imageFile = req.file;
    
    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !degree ||
      !experience||
      !about ||
      !fees||
      !speciality||
      !address ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({ sucess: false, message: "Please fill all the fields" });
      }


    // check duplicate email
    const existDoctorEmail = await  doctorModel.findOne({ email });
    if (existDoctorEmail) {
      return res.status(400).json({ sucess: false, message: "Email already exist"
        });
      }


    // validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ sucess: false, message: "Please enter valid email" });
    }

    // validate password strong format
    if (password.length < 5) {
      return res
        .status(400)
        .json({
          sucess: false,
          message: "Please enter 5 digit strong password",
        });
    }


    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res
      .status(201)
      .json({ sucess: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to add doctor" });
  }
};

// API for admin login

const adminLogin = async (req, res) => {
    try{
        const  { email, password } = req.body;

        if(email === process.env.ADMIN_EMAIL  && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.status(200).json({success:true,message: "Admin logged in successfully" ,token:token})
        }else{
            res.status(401).json({ message: "Invalid email or password" });
        }
    }catch{
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

// API to get all doctor list

const allDoctors = async(req,res)=>{
  try{
    const doctors = await doctorModel.find().select("-password");
    res.status(200).json({success:true,message:"All doctors list",doctors})
    }catch(error){
      console.log(error)
      res.status(500).json({message:error.message})
    }
}

export { addDoctor,adminLogin,allDoctors };
