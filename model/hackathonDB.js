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
        type:String,

    }
})
const hackathonModel =  mongoose.model('hackathonModel',hackathonSchema)

export {hackathonModel}