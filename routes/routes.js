import express from 'express'
import { Login,SignUp, fetchAllUsers,editProfile,getMyTeams, getNotifications,logout} from '../controllers/userCRUD.js'
import { validateUser,loginValidator } from '../middlewares/validator.js'
import { fetchAllHackathons,createHackathon,deleteHackathon } from '../controllers/hackathonCRUD.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { verifyUser } from '../middlewares/verify.js'
import { createTeam, getTeams } from '../controllers/teamCRUD.js'
import { sendInvite } from '../controllers/sendInvite.js'
import { respondInvite } from '../controllers/respondInvite.js'
import { registerTeamForHackathon } from '../controllers/teamHackathon.js'
import { get } from 'mongoose'

const router = express.Router()



router.post('/SignUp',validateUser,SignUp)
router.post('/Login',loginValidator, Login)
router.get('/fetchAllUsers',verifyUser,fetchAllUsers)
router.patch('/editProfile',verifyUser,editProfile)
router.get('/getNotifications',verifyUser,getNotifications)
router.get('/logout',verifyUser,logout)

//hackathon routers
router.post('/createHackathon',verifyUser,isAdmin,createHackathon)
router.get('/deleteHackathon',verifyUser,isAdmin,deleteHackathon)
router.get('/fetchAllHackathon',verifyUser,fetchAllHackathons)

//team routers
router.get('/fetchAllTeams',verifyUser,isAdmin,getTeams) // this is an admin function 
router.post('/createTeam', verifyUser,createTeam)
router.post('/sendInvite',verifyUser,sendInvite)
router.post('/respondInvite',verifyUser,respondInvite)
router.get('/getMyTeams',verifyUser,getMyTeams)

//team to hackathon registration 
router.post('/registerTeamForHackathon',verifyUser,registerTeamForHackathon)
export {router}