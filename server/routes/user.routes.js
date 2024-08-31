import express from 'express';

import { deleteUser, getParticularUser, getUsers, logOutUser, loginUser, registerUser, updateUserDetails, updateUserPassword } from '../controllers/user.controllers.js';
import {isAuthenticated, isUserAuthenticated} from '../middlewares/auth.js'


import rateLimit from 'express-rate-limit';

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: "Too many accounts created from this IP, please try again after 15 minutes"
  });


  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, 
    message: "Too many accounts created from this IP, please try again after 15 minutes"
  });



router.post('/registerUser',registerLimiter,registerUser)
router.post('/loginUser',loginLimiter,loginUser);
router.get('/logoutUser',isUserAuthenticated,logOutUser);

router.delete('/deleteUser',isUserAuthenticated,deleteUser);

router.get('/getUserProfile',isUserAuthenticated,getParticularUser);
router.get('/getUsers',getUsers);

router.put('/updateUserDetails',isUserAuthenticated,updateUserDetails);
router.put('/updateUserPassword',isUserAuthenticated,updateUserPassword);




export default router;