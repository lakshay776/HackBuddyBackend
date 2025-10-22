import jwt from 'jsonwebtoken'
import { userModel } from '../model/userDB.js'

async function verifyUser(req,res,next){
    try{
        const token = req.cookies.token
        if(!token) return res.status(401).json({message:"unauthorised"})
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await userModel.findById(decoded._id)
        if(!user) return res.status(404).json({message:"user not found"})
        req.user=user
        next()
     }catch(error){
        res.json(402).json({error:"invalid or expired token"})

    }
}
export {verifyUser}