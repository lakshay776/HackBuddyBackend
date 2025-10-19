import { userModel } from "../model/userDB.js";
import bcryptjs from 'bcryptjs'

async function SignUp(req,res){
    try{
    const {Name, DOB, email, password, phoneNumber}= req.body
    const existingUser= await userModel.findOne({email:email})
    const hashedPassword= await bcrypt.hash(password,10)
    if(!existingUser){
        const newUser= await userModel.create({
            Name:Name,
            DOB:DOB, 
            email:email,
            password:hashedPassword,
            phoneNumber:phoneNumber
        })
        res.status(201).json({message:"user created successfully"})
    }else{
        res.status(400).json({error:"email already registered"})
    }
}catch(error){
    console.log(error)
}
}


export {SignUp}