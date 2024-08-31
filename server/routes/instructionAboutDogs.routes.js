import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { deleteInstruction, getAllInstructions, postInstruction } from '../controllers/instructionsAboutDog.controllers.js';
import redisCache from '../database/redis.js';

const router  = express.Router();

router.post('/postInstruction',isAuthenticated,postInstruction);
router.get('/getAllInstructions',redisCache.route({expire:60*30}),getAllInstructions);


router.delete('/deleteInstruction/:id',isAuthenticated,deleteInstruction);

redisCache.del('/api/v1/instructionAboutDog/getAllInstructions',(err)=>{
    if(err){
        throw err;
    }
})


export default router;