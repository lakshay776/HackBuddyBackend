import { userModel } from "../model/userDB.js"
import { teamModel } from "../model/teamDB.js"
async function sendInvite(req,res){
    try{
        const {teamId, userId} = req.body
        const team = await teamModel.findById(teamId)
        if(!team) return res.status(404).json({error:"team not found"})
        
        if(team.teamLeader.toString() !== req.user._id.toString()){
            return res.status(403).json({error:"only team leader can send invites"})
        }

        const alreadyInvited = team.invitations.find(invite => invite.user.toString() === userId)
        if(alreadyInvited) return res.status(400).json({error:"user already invited"})

        // Add invitation to team
        team.invitations.push({user:userId})
        await team.save()

        // Add notification for the invited user
        await userModel.findByIdAndUpdate(userId, {
            $push:{
                notifications:{
                    teamId:team._id,
                    message:`You have been invited to join the team "${team.teamName}"`,
                    type:'Invite'
                }
            }
        })

        res.status(200).json({message:"invite sent successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:error})
    }
}

export {sendInvite}