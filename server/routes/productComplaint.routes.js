import express from 'express';
import { isAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';
import { postProductComplaint,getComplaints } from '../controllers/productComplaint.controllers.js';
import redisCache from '../database/redis.js';


const router = express.Router();

router.post('/postComplaint',isUserAuthenticated,postProductComplaint);
router.get('/getComplaint',isAuthenticated,getComplaints);


export default router;