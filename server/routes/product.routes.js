import express from 'express';
import { isAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';
import { postProduct,getProducts } from '../controllers/product.controllers.js';
import redisCache from '../database/redis.js';

const router = express.Router();

router.post('/postProduct',postProduct);
router.get('/getProducts',redisCache.route({expire:60*30}),getProducts);

redisCache.del('/api/v1/product/getProducts',(err)=>{
    if(err){
        throw err;
    }
})


export default router;