import express from 'express'
import { loginCoach, setCoachAvailability } from '../controller/coachController.js'
import authCoach from '../middleware/authCoach.js';

const coachRoute = express.Router()

coachRoute.post('/login', loginCoach)
coachRoute.patch("/set-availability", authCoach, setCoachAvailability);


export default coachRoute