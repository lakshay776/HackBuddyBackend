import { userModel } from "../model/userDB.js";
import { teamModel } from "../model/teamDB.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function fetchAllUsers(req,res){
    try{
        const users= await userModel.find()
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({error:"interenal server error"})
    }
}

async function SignUp(req,res){
    try{
    const body= req.body
    const existingUser= await userModel.findOne({email:body.email})
    body.password= await bcrypt.hash(body.password,10)
    if(!existingUser){
        const newUser= await userModel.create(body)
        res.status(201).json({message:"user created successfully"})
    }else{
        res.status(400).json({error:"email already registered"})
    }
}catch(error){
    res.status(500).json({error:"internal server error"})
}
}

async function Login(req,res){
    try{
        const {email,password}= req.body
        const existingUser= await userModel.findOne({email:email})
        if(!existingUser) return res.status(404).json({error:"user not found"})
        
          const passwordCheck= await bcrypt.compare(password,existingUser.password)
            if(!passwordCheck) return res.status(400).json({error:"wrong password"})
        const token = jwt.sign({
            _id:existingUser._id,
            email:existingUser.email
        },process.env.JWT_SECRET,{expiresIn:"7d"})
        
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000
        })
        res.status(200).json(existingUser._id , existingUser.Name, existingUser.email)  
            


    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}


async function editProfile(req,res){
    try{
    const changes = req.body 
    const user = req.user._id

    const updatedUser = await userModel.updateOne({_id:user._id},changes)
    res.status(201).json({message:"profile edit successfull",updatedUser:updatedUser})
    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}

async function getMyTeams(req,res){
    try{
        const teamIds = req.user.teams
        const teams = await teamModel.find({_id:{$in:teamIds}})

        res.status(200).json(teams)
    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}
async function getNotifications(req,res){
    try{
        const user =await userModel.findById(req.user._id)
        const notifications= user.notifications
        res.status(200).json(notifications)
    }catch(error){
        res.status(500).json({error:error})
    } 
}

// controllers/authController.js
async function logout(req,res){
    try{
        res.clearCookie('token', {httpOnly:true, secure:true, sameSite:'none'})
        return res.status(200).json({message:'Logged out successfully'})
    }catch(error){
        console.error(error)
        return res.status(500).json({error:'Internal server error'})
    }
}


export {SignUp,Login, fetchAllUsers,editProfile, getMyTeams,getNotifications,logout}