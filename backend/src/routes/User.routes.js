    import express from 'express';

    import { LogIn, Register } from '../controllers/User.controllers.js';

    const UserRoute = express.Router();

    UserRoute.post('/sign-Up',Register);
    UserRoute.post('/log-In', LogIn);

    export default UserRoute