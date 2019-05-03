import mongoose from 'mongoose'

const dburl = process.env.DATABASE_URL || 'mongodb://mongoadmin:secret@localhost:27017/mongo?authSource=admin'

const connectDb = () => {
  return mongoose.connect(dburl, { useNewUrlParser: true });
}

export default connectDb

