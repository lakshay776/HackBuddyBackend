import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './controllers/DB.js'
import { router } from './routes/routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()
const app=express()
app.use(express.json())
app.use(cookieParser())
connectDB()


app.use('/Hack',router)

const port = process.env.port || 8000
app.listen(port,()=>{
    console.log("server started")
})

