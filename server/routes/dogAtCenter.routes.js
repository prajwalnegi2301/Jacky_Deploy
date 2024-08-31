import express from 'express';
import { isAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';
import {  deleteService, getAllUsersWithDogAtCenter, registerForDogStayAtCenter, updateAppointmentStatus } from '../controllers/dogAtCenter.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/createService/centerVisit',isUserAuthenticated,registerForDogStayAtCenter);

router.get('/getAllServices/centerVisit',isAuthenticated,getAllUsersWithDogAtCenter);

router.delete('/deleteService/centerVisit/:id',isUserAuthenticated,deleteService);

router.put('/updateAppointment/:id',isAuthenticated,updateAppointmentStatus);



export default router;