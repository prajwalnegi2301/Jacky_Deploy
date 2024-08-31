import express from 'express';

import {isAuthenticated} from '../middlewares/auth.js'
import { getParticularAdmin, logOutAdmin, loginAdmin, registerAdmin, updateAdminDetails, updateAdminPassword } from '../controllers/admin.controllers.js';
import { getInstructorAppointmentsForHomeVisit, updateAppointmentStatus } from '../controllers/instructorAppointmentAtHome.controllers.js';
import { logOutDoctor } from '../controllers/doctor.controllers.js';
import { logOutInstructor } from '../controllers/instructor.controllers.js';
const router = express.Router();


router.post('/registerAdmin',registerAdmin)
router.post('/loginAdmin',loginAdmin);
router.get('/logoutAdminlogOutAdmin',isAuthenticated,logOutAdmin);
router.get('/logoutDoctor',isAuthenticated,logOutDoctor);
router.get('/logoutInstructor',isAuthenticated,logOutInstructor);


router.get('/getAdminProfile',isAuthenticated,getParticularAdmin);


router.put('/updateAdminDetails',isAuthenticated,updateAdminDetails);
router.put('/updateAdminPassword',isAuthenticated,updateAdminPassword);



export default router;