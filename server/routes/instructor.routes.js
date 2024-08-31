import express from 'express';
import { deleteInstructor, getInstructors, getParticularInstructor, logOutInstructor, loginInstructor, registerInstructor, updateInstructorDetails, updateInstructorPassword } from '../controllers/instructor.controllers.js';
import {isAuthenticated, isInstructorAuthenticated, isUserAuthenticated} from '../middlewares/auth.js'
import redisCache from '../database/redis.js';


const router = express.Router();


router.post('/registerInstructor',isAuthenticated,registerInstructor)
router.post('/loginInstructor',loginInstructor);
router.get('/logOutInstructor',isInstructorAuthenticated,logOutInstructor);

router.delete('/deleteInstructor',isInstructorAuthenticated,deleteInstructor);

router.get('/getInstructorProfile',redisCache.route({expire:60*30}),getParticularInstructor);
router.get('/getInstructors',redisCache.route({expire:60*30}),getInstructors);

router.put('/updateInstructorDetails',isInstructorAuthenticated,updateInstructorDetails);
router.put('/updateInstructorPassword',isInstructorAuthenticated,updateInstructorPassword);

redisCache.del('/api/v1/instructor/getInstructorProfile',(err)=>{
    if(err){
        throw err;
    }
})
redisCache.del('/api/v1/instructor/getInstructors',(err)=>{
    if(err){
        throw err;
    }
})

export default router;