import doctorModel from "../models/doctorModel.js";

const changeAvailablity = async(req,res)=>{

    try {
        const {docId} = req.body;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message: "Availability changed successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const  getDoctorsList = async(req,res)=>{
    try {
        const doctors = await doctorModel.find().select(['-password','-email'])
        res.status(200).json({success:true,doctors})
    }catch(err){
        console.log(error)
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

export {changeAvailablity,getDoctorsList}