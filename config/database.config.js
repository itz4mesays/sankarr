const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGO_URI,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
      })

      console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
      console.log(`Error: ${error}`)
      process.exit(1)
  }  
}

module.exports = connectDB