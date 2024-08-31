import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { deleteDogCharacteristics, dogCharacteristicsGet, dogCharacteristicsPost, getAllDogCharacteristics, updateDogCharacteristics } from '../controllers/dogCharacteristics.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/post',isAuthenticated,dogCharacteristicsPost);

router.get('/infoAboutBreed/:breed',dogCharacteristicsGet);

router.get('/getAllBreeds', redisCache.route({expire:60*30}),getAllDogCharacteristics);


router.put('/update/:breed',isAuthenticated,updateDogCharacteristics);

router.delete('/deletePost/:breed',isAuthenticated,deleteDogCharacteristics);

redisCache.del('/api/v1/dogCharacteristics/getAllBreeds',(err)=>{
    if(err){
        throw err;
    }
})


export default router;