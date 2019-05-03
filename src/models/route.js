import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    time: Number,
    energy: Number,
    gps: [String],
    odo: Number,
    speed: Number,
    soc: Number
  }
);

const Route = mongoose.model('Route', routeSchema);

export default Route;