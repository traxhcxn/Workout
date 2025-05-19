const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB Connected: ${conn.connection.host}`)
        return conn.connection.db
    } catch(error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}

module.exports = connectDB