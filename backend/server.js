import express from 'express'
import cors from 'cors'
import connectDB from './Config/connectDB.js'
import UserRouter from './Routes/UserRoute.js'
import dotenv from 'dotenv'
dotenv.config()

connectDB()

const app = express()
const PORT =4000


// middleware

app.use(cors({
    origin :'http://localhost:5173',
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors());

app.get('/', (req,res) => {
    res.send('Backend is Running successfully!')
})

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/uploads', express.static('uploads'))

// api endpoint
app.use('/api/user', UserRouter)

// server start
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
    
})