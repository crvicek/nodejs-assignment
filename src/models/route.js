import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    time: Date,
    energy: Number,
    gps: [String],
    odo: Number,
    speed: Number,
    soc: Number
  },
  { timestamps: { createdAt: 'created_at' } }
)
export default routeSchema