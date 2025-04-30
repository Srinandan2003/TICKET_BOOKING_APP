import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv';
configDotenv();

import UserRoute from './src/routes/User.routes.js';
import SeatRouter from './src/routes/seat.routes.js';

const app = express();


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://ticket-booking-app-one.vercel.app"],
    
  }));



app.use('/api/auth',UserRoute)
app.use('/api/seat',SeatRouter)
app.post("/bookings/reset", async (req, res) => {
  const { userId } = req.body;
  await BookingModel.deleteMany({ userId });
  res.status(200).send({ msg: "Bookings reset." });
});

export default app