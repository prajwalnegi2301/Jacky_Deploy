import express from 'express';
import { isAuthenticated, isInstructorAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';
import { createInstructorAppointmentAtHome, deleteAppointment, getAllAppointmentsForHomeVisit, getInstructorAppointmentsForHomeVisit, updateAppointmentStatus } from '../controllers/instructorAppointmentAtHome.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();


router.post('/postAppointment',isUserAuthenticated,createInstructorAppointmentAtHome);

router.get('/getAllAppointments',redisCache.route({expire:60*30}),getAllAppointmentsForHomeVisit);

router.get('/particularInstructor/getAppointments/forInstructor/:instructorId',isInstructorAuthenticated,getInstructorAppointmentsForHomeVisit);


router.get('/homeVisit/getParticular/instructor/admin/:instructorId',isAuthenticated,getInstructorAppointmentsForHomeVisit);

router.put('/homeVisit/updateStatus/appointment/admin/:appointmentId',isAuthenticated,updateAppointmentStatus);

router.delete('/deleteAppointment/:appointmentId',isUserAuthenticated,deleteAppointment);


redisCache.del('/api/v1/instructorAppointmentAtHome/getAllAppointments',(err)=>{
    if(err){
        throw err;
    }
})

export default router;