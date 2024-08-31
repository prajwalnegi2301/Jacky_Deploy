import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth.js';
import { getAllFeedBacks, getAllFeedbackOfParticularInstructor, postFeedback } from '../controllers/feedbackForInstructor.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/postFeedback',isUserAuthenticated,postFeedback);

router.get('/getFeedback',getAllFeedbackOfParticularInstructor);

router.get('/getAllFeedbacks', redisCache.route({expire:60*30}),getAllFeedBacks);


redisCache.del('/api/v1/feedbackForInstructor/getAllFeedbacks',(err)=>{
    if(err){
        throw err;
    }
})


export default router;