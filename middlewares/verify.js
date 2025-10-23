import jwt from 'jsonwebtoken'
import { userModel } from '../model/userDB.js'

async function verifyUser(req,res,next){
    try{
        // Check for token in Authorization header first, then fallback to cookies
        let token = req.cookies?.token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }

        if(!token) return res.status(401).json({message:"unauthorised"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded._id)
        if(!user) return res.status(404).json({message:"user not found"})
        req.user=user
        next()
     }catch(error){
        console.error('Token verification error:', error);
        res.status(401).json({error:"invalid or expired token"})
    }
}
export {verifyUser}