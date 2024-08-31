import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { deletePuppy, getAllPuppies, getParticularPuppies, puppyPost } from '../controllers/puppyAdopt.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/postDetails',isAuthenticated,puppyPost);
router.get('/getAllDetails', redisCache.route({expire:60*30}),getAllPuppies);

router.delete('/deleteDetails/:id',isAuthenticated,deletePuppy);
router.get('/getParticularPuppy', redisCache.route({expire:60*30}),getParticularPuppies);

redisCache.del('/api/v1/puppyAdopt/getAllDetails',(err)=>{
    if(err){
        throw err;
    }
})

redisCache.del('/api/v1/puppyAdopt/getParticularPuppy',(err)=>{
    if(err){
        throw err;
    }
})


export default router;