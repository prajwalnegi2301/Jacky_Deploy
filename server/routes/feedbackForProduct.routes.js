import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth.js';
import { getAllFeedBacks, getAllFeedbackOfParticularProduct, postFeedbackForProduct } from '../controllers/feedbackForProduct. controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();


router.post('/feedback/product/createProduct',isUserAuthenticated,postFeedbackForProduct);
router.get('/feedback/product/particularProduct/:id',getAllFeedbackOfParticularProduct);
router.get('/feedback/product/getAllFeedbacks',redisCache.route({expire:60*30}),getAllFeedBacks);

redisCache.del('/api/v1/feedbackForProduct/feedback/product/getAllFeedbacks',(err)=>{
    if(err){
        throw err;
    }
})


export default router;