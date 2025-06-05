require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const authRoutes = require('./routers/authRouter')
const routineRoutes = require('./routers/routineRoute')

const app = express()

app.use(express.json())
app.use(cors())


connectDB()

app.get('/', (req, res) => {
    res.send('API is running')
})
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`)
    next()
})
app.use('/api', authRoutes)
app.use('/api/routines', routineRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Server running at ${PORT}`))