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
        
        // Generate JWT token for the new user
        const token = jwt.sign({
            _id: newUser._id,
            email: newUser.email
        }, process.env.JWT_SECRET, {expiresIn: "7d"})
        
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000
        })
        
        // Return success with token and user data
        res.status(201).json({
            success: true,
            message: "user created successfully",
            token: token,
            user: newUser
        })
    }else{
        res.status(400).json({success: false, error:error})
    }
}catch(error){
    res.status(500).json({success: false, error:"internal server error"})
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
        res.status(200).json({
            success: true,
            message: "login successful",
            token: token,
            user: {
                _id: existingUser._id,
                Name: existingUser.Name,
                email: existingUser.email,
                phoneNumber: existingUser.phoneNumber,
                college: existingUser.college,
                Score: existingUser.Score
            }
        })  
            


    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}


async function editProfile(req,res){
    try{
    const changes = req.body
    const user = req.user._id

    const updatedUser = await userModel.updateOne({_id:user._id},changes)
    res.status(201).json({
        success: true,
        message:"profile edit successfull",
        updatedUser:updatedUser
    })
    }catch(error){
        console.error('Edit profile error:', error);
        res.status(500).json({
            success: false,
            error:"internal server error",
            details: error.message
        })
    }
}

async function getMyTeams(req,res){
    try{
        console.log('User teams:', req.user.teams);
        const userId = req.user._id;

        // Find teams where user is either team leader or a member
        const teams = await teamModel.find({
            $or: [
                { teamLeader: userId },
                { 'members.users': userId }
            ]
        })
        .populate('members.users', 'Name email')
        .populate('teamLeader', 'Name email')

        console.log('Found teams:', teams.length);

        // Update user's teams array if it's missing any teams
        const teamIds = teams.map(team => team._id);
        const currentTeamIds = req.user.teams || [];

        const missingTeams = teamIds.filter(teamId => !currentTeamIds.includes(teamId.toString()));

        if (missingTeams.length > 0) {
            console.log('Updating user teams array with missing teams:', missingTeams);
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { teams: { $each: missingTeams } }
            });
        }

        res.status(200).json(teams)
    }catch(error){
        console.error('getMyTeams error:', error);
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