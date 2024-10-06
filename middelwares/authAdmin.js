import jwt from "jsonwebtoken"

// ADMIN authentication middelware

const authAdmin = async(req,res,next) =>{
    try {
        const {aToken} = req.headers;

        if(!aToken){
            return res.status(401).json({success:false,message:"Not Authorized user"})
        }
        const token_decoded = jwt.verify(aToken,process.env.JWT_SECRET);
        if(token_decoded != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(401).json({success:false,message:"Not Authorized user"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export default authAdmin