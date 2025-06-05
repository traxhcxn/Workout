require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const authRoutes = require('./routers/authRouter')
const routineRoutes = require('./routers/routineRoute')

const app = express()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://workout-server-n7s8.onrender.com'],
    credentials: true
}))


connectDB()

app.use('/api', authRoutes)
app.use('/api/routines', routineRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Server running at ${PORT}`))