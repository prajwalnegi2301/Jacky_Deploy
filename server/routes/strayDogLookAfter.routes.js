import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth.js';
import { createStrayDogLookAfter, getAllStrayDogLookAfter } from '../controllers/strayDookLookAfter.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/createPost',isUserAuthenticated,createStrayDogLookAfter);

router.get('/getAllPosts', redisCache.route({expire:60*30}),getAllStrayDogLookAfter);

redisCache.del('/api/v1/strayDog/getAllPosts',(err)=>{
    if(err){
        throw err;
    }
})


export default router;