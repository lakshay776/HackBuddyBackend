import mongoose from "mongoose";
import { hackathonModel } from "./hackathonDB";

const teamSchema = new mongoose.Schema({
    teamName:{
        type:String,
        required:true
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel'
    },
    Goal:{
        type:String,
        rewuired:true
    },
    members:[{
        users:{type:mongoose.Schema.Types.ObjectId,
        ref:'userModel'
        },
        role:{
            type:String
        }
    }],
    hackathonsRegistered:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'hackathonModel'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const teamModel=  mongoose.model('teamModel',teamSchema)
export {teamModel}