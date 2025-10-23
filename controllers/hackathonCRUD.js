import { hackathonModel } from "../model/hackathonDB.js"


async function fetchAllHackathons(req,res){
    try{
        const hacakathons= await hackathonModel.find()
        res.status(200).json(hacakathons)
    }catch(error){
        res.status(500).json({error:"internal server error"})
    }
}


async function createHackathon(req,res){
    try{
    const {HackathonName,EventDate,TeamSize,Description,LastRegistrationDate}= req.body
    if(!HackathonName || !EventDate || !TeamSize || !Description || !LastRegistrationDate ){
        return res.status(400).json({error:"fields missing"})
    }
    const createdBy = req.user._id
    const organizer = req.user.college
    const newHackathon = await hackathonModel.create({
        HackathonName:HackathonName,
        EventDate:EventDate,
        TeamSize:TeamSize,
        Description:Description,
        LastRegistrationDate:LastRegistrationDate,
        organizer:organizer,
        createdBy:createdBy
    })
    res.status(201).json({message:"new hackathon created",hackathon:newHackathon})
}catch(error){
    res.status(500).json({error:"internal server error",error:error})
}
}
async function deleteHackathon(req,res){
    try{
        const {HacakathonName}= req.params
        const existingHackathon = await hackathonModel.findOne({HackathonName:HacakathonName})
        if(!existingHackathon) return res.status(404).json({error:"hackathon not found"})
        await hackathonModel.deleteOne({_id:existingHackathon._id})
        res.status(200).json({message:"successfully deleted the hackathon"})
    }catch(error){
        res.status(500).json({error:'internal server error'})
    }

}



export {createHackathon,deleteHackathon,fetchAllHackathons}
