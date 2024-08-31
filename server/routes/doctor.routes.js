import express from 'express';
import {isAuthenticated, isDoctorAuthenticated, } from '../middlewares/auth.js'
import { deleteDoctor, getDoctors, getParticularDoctor, logOutDoctor, loginDoctor, registerDoctor, updateDoctorDetails, updateDoctorPassword } from '../controllers/doctor.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();


router.post('/registerDoctor',isAuthenticated,registerDoctor)
router.post('/loginDoctor',loginDoctor);
router.get('/logoutDoctor',isDoctorAuthenticated,logOutDoctor);

router.delete('/deleteDoctor',isAuthenticated,deleteDoctor);

router.get('/getDoctorProfile',redisCache.route({expire:60*30}),getParticularDoctor);
router.get('/getDoctors',isAuthenticated,getDoctors);

router.put('/updateDoctorDetails',isDoctorAuthenticated,updateDoctorDetails);
router.put('/updateDoctorPassword',isDoctorAuthenticated,updateDoctorPassword);


// redisCache.del('/api/v1//delAppointment',(err)=>{
//     if(err){
//         throw err;
//     }
// })

// router.get('/send-email', sendtestEmail);

export default router;