import { userModel } from "../model/userDB.js"
import { teamModel } from "../model/teamDB.js"
async function sendInvite(req,res){
    try{
        console.log('Send invite request body:', req.body);
        console.log('User ID from token:', req.user._id);

        const {teamId, userId} = req.body

        if (!teamId || !userId) {
            console.log('Missing teamId or userId');
            return res.status(400).json({error:"teamId and userId are required"})
        }

        const team = await teamModel.findById(teamId)
        if(!team) {
            console.log('Team not found:', teamId);
            return res.status(404).json({error:"team not found"})
        }

        console.log('Team found:', team.teamName);
        console.log('Team leader ID:', team.teamLeader);
        console.log('Request user:', req.user._id);

        if(team.teamLeader.toString() !== req.user._id.toString()){
            console.log('User is not team leader');
            return res.status(403).json({error:"only team leader can send invites"})
        }

        // Check if user is already invited (handle both old and new invitation structures)
        const alreadyInvited = team.invitations.find(invite =>
            (invite.user?.toString() === userId) ||
            (invite.toString() === userId) // fallback for old structure
        );
        if(alreadyInvited) {
            console.log('User already invited');
            return res.status(400).json({error:"user already invited"})
        }

        // Add invitation to team
        console.log('Adding invitation to team...');
        team.invitations.push({
            user: userId,
            sentAt: new Date(),
            status: 'Pending'
        });

        console.log('Saving team...');
        try {
            await team.save();
            console.log('Team saved successfully');
        } catch (saveError) {
            console.error('Team save error:', saveError);
            console.error('Team validation errors:', saveError.errors);
            throw saveError;
        }

        // Add notification for the invited user
        console.log('Adding notification for user:', userId);
        console.log('Team ID for notification:', team._id);

        // First check if user exists
        console.log('Checking if target user exists...');
        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            console.log('Target user not found:', userId);
            return res.status(404).json({error:"user not found"});
        }

        console.log('Target user found:', targetUser.Name);

        console.log('Updating user notifications...');
        console.log('Target user notifications before update:', targetUser.notifications);

        const notificationResult = await userModel.findByIdAndUpdate(userId, {
            $push:{
                notifications:{
                    teamId:team._id,
                    message:`You have been invited to join the team "${team.teamName}"`,
                    type:'Invite'
                }
            }
        });

        console.log('Notification update result:', notificationResult);

        res.status(200).json({message:"invite sent successfully"})
    }catch(error){
        console.error('Send invite error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({error:error})
    }
}

export {sendInvite}