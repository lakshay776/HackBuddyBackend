import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './controllers/DB.js'
import { router } from './routes/routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()
const app=express()

// CORS configuration
app.use(cors({
    origin: ['https://hack-buddy-hazel.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json())
app.use(cookieParser())
connectDB()


app.use('/Hack',router)

const port = process.env.port || 5000
app.listen(port,()=>{
    console.log("server started")
})

