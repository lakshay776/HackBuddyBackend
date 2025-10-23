import { userModel } from "../model/userDB.js";
import { teamModel } from "../model/teamDB.js";
import { hackathonModel } from "../model/hackathonDB.js";


async function registerTeamForHackathon(req,res){
    try{
        const {teamId,hackathonId} = req.body

        const team = await teamModel.findById(teamId)
        const hackathon = await hackathonModel.findById(hackathonId)

        if(!team) return res.status(404).json({error:"team not found"})
        if(!hackathon) return res.status(404).json({error:"hackathon not found"})

        if(hackathon.teams.includes(team._id)){
            return res.status(400).json({error:"team already registered"})
        }

        hackathon.teams.push(team._id)
        team.hackathonsRegistered.push(hackathon._id)

        await hackathon.save()
        await team.save()

        console.log(`Team ${team.teamName} registered for hackathon ${hackathon.HackathonName}`)

        //add the hackathon and the team for that as an array in the userModel in each member's data
        for(const member of team.members){
            const user = await userModel.findById(member.users)
            if(user){
                // Check if user is already registered for this hackathon with this team
                const alreadyRegistered = user.hackathonsRegistered.some(reg =>
                    reg.hackathon.toString() === hackathon._id.toString() &&
                    reg.team.toString() === team._id.toString()
                )

                if (!alreadyRegistered) {
                    user.hackathonsRegistered.push({
                        hackathon:hackathon._id,
                        team:team._id
                    })
                    await user.save()
                    console.log(`Added ${user.Name} in team ${team.teamName} to hackathon ${hackathon.HackathonName}`)
                }
            }
        }

        res.status(200).json({message:`Team "${team.teamName}" registered successfully`})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

export {registerTeamForHackathon}
