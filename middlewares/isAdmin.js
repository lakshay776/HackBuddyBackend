import { userModel } from "../model/userDB.js";

async function isAdmin(req,res,next){
    try{
    const role=req.user.role
    if(role!=="Admin") return res.status(401).json({message:"you are unauthorized"})
        next()
    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}
export {isAdmin}