import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth.js';
import { deleteDogMateService, dogMatePost, getAllDogsForMating, getDogByBreed } from '../controllers/dogMateService.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();


router.post('/post',isUserAuthenticated,dogMatePost);

router.delete('/delete/:id',isUserAuthenticated,deleteDogMateService);

router.get('/getAllDogs', redisCache.route({expire:60*30}),getAllDogsForMating);


redisCache.del('/api/v1/dogMate/getAllDogs',(err)=>{
    if(err){
        throw err;
    }
})

export default router;