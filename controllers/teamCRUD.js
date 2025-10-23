import { teamModel } from "../model/teamDB.js";
import { userModel } from "../model/userDB.js";

async function createTeam(req,res){
    try{
        const body = req.body
        body.teamLeader = req.user._id // the team leader will be the user who created the team by default (can add a feature to change the leader later)
        if(!body.teamName || !body.Goal) return res.status(400).json({error:"all fields are required"})
         body.members = [{
            users:req.user._id,
            role:'Team Leader'
        }];

        const newTeam = await teamModel.create(body)

        // Add the team ID to the user's teams array
        await userModel.findByIdAndUpdate(
            req.user._id,
            { $push: { teams: newTeam._id } },
            { new: true }
        );

        res.status(201).json({message:"created new Team", team:newTeam})

    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}
async function getTeams(req,res){ // a normal user shall not be able to use this function as this will exose all the teams that are on this platform 
    try{
    const teams = await teamModel.find()
    if(!teams) return res.status(404).json({error:"teams not fund"})
        res.status(200).json(teams)
    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}
export {createTeam,getTeams}

//function to fetch the teams of the user is in the userCRUD.js file
