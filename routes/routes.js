import express from 'express'
import { SignUp } from '../controllers/userCRUD.js'
import { validateUser } from '../middlewares/validator.js'
const router = express.Router()


router.post('/SignUp',SignUp)


export {router}