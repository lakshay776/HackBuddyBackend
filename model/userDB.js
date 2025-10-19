import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    Score:{
        type:Number,
        default:0
    },
    phoneNumber:{
        type:String,
        required:true
    },
    college:{
        type:String,
        default:"Scaler School of Technology"
    },
    githubLink:{
        type:String
    },
    LinkdInLink:{
        type:String
    }
})
const userModel =  mongoose.model('userModel',userSchema)
export {userModel}