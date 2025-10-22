import { teamModel } from "../model/teamDB.js"
import { userModel } from "../model/userDB.js"

async function respondInvite(req, res) {
    try {
        const { teamId, response } = req.body // response = "Accepted" or "Rejected"

        // Find the team
        const team = await teamModel.findById(teamId)
        if (!team) return res.status(404).json({ error: "team not found" })

        // Find the invitation for this user
        const invite = team.invitations.find(inv => inv.user.toString() === req.user._id.toString())
        if (!invite) return res.status(400).json({ error: "no invitation found" })

        // Update invitation status
        invite.status = response
        await team.save()

        if (response === 'Accepted') {
            // Add user to team members if not already
            const alreadyMember = team.members.some(m => m.users.toString() === req.user._id.toString())
            if (!alreadyMember) {
                team.members.push({ users: req.user._id, role: 'Member' })
                await team.save()
            }

            // Add this team to user's teams array if not already
            const userInTeam = await userModel.findById(req.user._id)
            const isAlreadyInTeam = userInTeam.teams.some(t => t.toString() === team._id.toString())
            if (!isAlreadyInTeam) {
                userInTeam.teams.push(team._id)
                await userInTeam.save()
            }
        }

        res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully` })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error", details: error.message })
    }
}

export { respondInvite }
