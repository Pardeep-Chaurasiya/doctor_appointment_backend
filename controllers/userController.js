import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointment.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 5" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .json({
        success: true,
        message: "User register successfully !!",
        userData,
        token: token,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// API for login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({
        success: true,
        message: "User login successfully !!",
        token: token,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// API to get user profile data
const getProfile  = async(req,res)=>{
  try {
    const {userId} = req.body;
    const user = await userModel.findById(userId).select('-password');
    res.status(200).json({success:true,message:"user  profile data",user:user});

  } catch (error) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
}

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name,userId,address,dob,gender,phone } = req.body;
    const imageFile = req.file;
    if(!name || !gender || !dob || !phone){
      return res.json({success:false,message:"Data missing"})
    }
    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
      const imageUrl = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId,{image:imageUrl})
    }
    res.status(200).json({success:true,message:"Profile Updated"})
  }catch(error){
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
}


// API to book appointment

const bookAppointment = async(req,res)=>{
  try{
    const {userId , docId,slotDate,slotTime} = req.body;

    const docData = await doctorModel.findById(docId).select('-password')

    if(!docData.available){
      return res.json({success:false,message:"Doctor not available"})
      }

      let slots_booked = docData.slots_booked
      
      // checking fot slot availablity

      if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
          return res.json({success:false,message:"Slot already booked"})
        }else{
          slots_booked[slotDate].push(slotTime)
        }
      }else{
        slots_booked[slotDate] = []
        slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select('-password')

      delete docData.slots_booked

      const appointmentData = {
        userId,docId,userData,docData,amount:docData.fees,slotTime,slotDate,date:Date.now()
      }

      const newAppointment = new appointmentModel(appointmentData)
      await  newAppointment.save()

      // save new slot data into doc data
      await doctorModel.findByIdAndUpdate(docId,{slots_booked})

      res.status(200).json({success:true,message:"Appointment booked"})
    }catch(error){
      console.log(error)
      res.status(500).json({success:false,message:error.message})
    }
}

// API for user appointment fot forntend my-appointment page

const listAppointment = async(req,res)=>{
  try{
    const {userId} = req.body
    const appointments = await  appointmentModel.find({userId})
    res.status(200).json({success:true,appointments})
  }
  catch(error){
    console.log(error)
    res.status(500).json({success:false,message:error.message})
  }

}

export { registerUser, loginUser,getProfile,updateProfile,bookAppointment,listAppointment };
