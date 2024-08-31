import express from 'express';

import { createAppointment, getAllAppoinments, getAppointmentOfParticularUser,  updateAppointmentStatus } from '../controllers/appointmentWithDoctor.controllers.js';
import { isAuthenticated, isUserAuthenticated} from '../middlewares/auth.js'
import redisCache from '../database/redis.js';


const router = express.Router();

router.post('/create',isUserAuthenticated,createAppointment);

router.get('/getAllAppointments',isAuthenticated,getAllAppoinments);
router.get('/getAppointmentOfParticularUser/:id',getAppointmentOfParticularUser);

router.put('/updateAppointmentWithDoctor/:id',isAuthenticated,updateAppointmentStatus);



export default router;