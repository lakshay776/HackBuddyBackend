import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
    HackathonName:{
        type:String, 
        required:true,
    },
    EventDate:{
        type:Date, 
        required:true
    },
    TeamSize:{
        type:Number, 
        required:true,
        default:1
    },
    Description:{
        type:String,
        required:true
    },
    LastRegistrationDate:{
        type:Date,
        required:true
    },
    ExternalLink:{
        type:String,

    },
    organizer:{
        type:String,
        required:true,
        default:"Scaler School of Technology"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    },
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"teamModel",
        default:[]
    }]
})
const hackathonModel =  mongoose.model('hackathonModel',hackathonSchema)

export {hackathonModel}