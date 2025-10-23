import { userModel } from "../model/userDB.js";
import { teamModel } from "../model/teamDB.js";

async function likeUser(req, res) {
    try {
        const { userId } = req.body;
        const likedById = req.user._id;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        // Check if the user being liked exists
        const userToLike = await userModel.findById(userId);
        if (!userToLike) {
            return res.status(404).json({ error: "user not found" });
        }

        // Prevent users from liking themselves
        if (userId === likedById) {
            return res.status(400).json({ error: "You cannot like your own profile" });
        }

        // Check if the current user exists
        const currentUser = await userModel.findById(likedById);
        if (!currentUser) {
            return res.status(404).json({ error: "current user not found" });
        }

        // Check if users are in the same team
        const commonTeams = currentUser.teams.filter(teamId =>
            userToLike.teams.some(userTeamId => userTeamId.toString() === teamId.toString())
        );

        if (commonTeams.length === 0) {
            return res.status(403).json({ error: "You can only like teammates" });
        }

        // Check if user has already liked this person
        const alreadyLiked = userToLike.likes.likedBy.some(likedBy =>
            likedBy.toString() === likedById.toString()
        );

        if (alreadyLiked) {
            return res.status(400).json({ error: "You have already liked this user" });
        }

        // Add the like
        userToLike.likes.count += 1;
        userToLike.likes.likedBy.push(likedById);
        await userToLike.save();

        return res.status(200).json({
            message: "User liked successfully",
            likesCount: userToLike.likes.count
        });
    } catch (error) {
        console.error("Error liking user:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export { likeUser };
