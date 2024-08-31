import express from 'express';
import { isAuthenticated,  } from '../middlewares/auth.js';
import { deleteTrainedDog, getAllTrainedDog, trainedDogPost } from '../controllers/wantATrainedDog.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/postDetails',isAuthenticated,trainedDogPost);

router.delete('/deleteDetails',isAuthenticated,deleteTrainedDog);

router.get('/getAllDogs', redisCache.route({expire:60*30}),getAllTrainedDog);

redisCache.del('/api/v1/wantATrainedDog/getAllDogs',(err)=>{
    if(err){
        throw err;
    }
})


export default router;