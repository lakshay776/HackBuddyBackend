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
    bio:{
        type:String
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
    },
    projects:[{
        title:{type:String,required:true},
        description:{type:String,required:true},
        link:{type:String,required:true}
    }],
    experience:[{
        company:{type:String,required:true},
        jobTitle:{type:String,required:true},
        description:{type:String,required:true}
    }],
    role:{
       type:String,
       default:"Student"
    },
    notifications:{
        teamId:{type:mongoose.Schema.Types.ObjectId, ref:'teamModel'},
        message:{type:String},
        status:{type:String, enum:['Unread','Read'], default:'Unread'},
        type:{type:String, enum:['Invite','System'], default:'Invite'},
        createdAt:{type:Date, default:Date.now}
    },
    hackathonsRegistered:[{
    hackathon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'hackathonModel',
        required:true
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teamModel',
        default:null  // null if the user participated solo
    }
}],
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teamModel'
    }],


})
const userModel =  mongoose.model('userModel',userSchema)
export {userModel}