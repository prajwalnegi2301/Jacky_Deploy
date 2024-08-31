// import { Queue, Worker } from 'bullmq';
// import { defaultQueueConfig, redisConnection } from '../config/queue.js'
// import User from '../models/user.models.js';
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import ErrorHandler from '../utils/errorMiddleware.js';
// import asyncErrorHandler from '../utils/asyncErrorHandler.js';
// import cloudinary from 'cloudinary'

// // import { registerQueue } from '../controllers/user.controllers.js';


// export const registerQueueName = 'register-queue';




// export const handler = new Worker(registerQueueName, async (job) => {
//   try {
   
//     return { tokenu };

//   } catch (error) {
//     console.error("Worker error:", error);
//     throw error; 
//   }
// }, { connection: redisConnection });


// handler.on("completed", (job) => {
//   console.log("Register worker completed", job.id);
// })

// handler.on("failed", (job) => {
//   console.log("Register worker failed", job.id);
// })



