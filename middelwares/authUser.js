import jwt from "jsonwebtoken"

// user authentication middelware

const authUser = async(req,res,next) =>{
    try {
        const {token} = req.headers;

        if(!token){
            return res.status(401).json({success:false,message:"Not Authorized user"})
        }
        const token_decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decoded.id
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export default authUser