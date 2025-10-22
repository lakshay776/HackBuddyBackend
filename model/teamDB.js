import mongoose from "mongoose";


const teamSchema = new mongoose.Schema({
    teamName:{
        type:String,
        required:true
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true
    },
    Goal:{
        type:String,
        required:true
    },
    members:[{
        users:{type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true
        },
        role:{
            type:String,
            default:'member'
        }
       
    }],
    hackathonsRegistered:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'hackathonModel',
        default:[]
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    invitations:[{
    user:{type:mongoose.Schema.Types.ObjectId, ref:'userModel'},
    sentAt:{type:Date, default:Date.now},
    status:{type:String, enum:['Pending','Accepted','Rejected'], default:'Pending'}
}],

})
const teamModel=  mongoose.model('teamModel',teamSchema)

export {teamModel}