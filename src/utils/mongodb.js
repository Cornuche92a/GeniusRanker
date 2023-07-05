import mongoose from 'mongoose'

const connectToDatabase = async () => {
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

export default connectToDatabase
