import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js'
import { bookSeat, status } from '../controllers/seat.controllers.js';

const SeatRouter = express.Router();

SeatRouter.post('/book', authMiddleware, bookSeat);

SeatRouter.get('/status', authMiddleware,status );


export default SeatRouter;
