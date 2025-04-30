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



app.use('api/auth',UserRoute)
app.use('api/seat',SeatRouter)
export default app