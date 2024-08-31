import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import { errorMiddleware } from './utils/errorMiddleware.js';
import database from './database/dbConnection.js';
import rateLimit from 'express-rate-limit';


import { Server } from 'socket.io';
import {createServer} from 'http';

import adminRouter from './routes/admin.routes.js';
import appointmentWithDoctorRouter from './routes/appointmentWithDoctor.routes.js';
import dogAtCenterRouter from './routes/dogAtCenter.routes.js';
import dogBlogRouter from './routes/dogBlog.routes.js';
import dogCharacteristicsRouter from './routes/dogCharacteristics.routes.js';
import dogMateRouter from './routes/dogMateService.routes.js';
import feedbackForInstructorRouter from './routes/feedbackForInstructor.routes.js';
import feedbackForProductRouter from './routes/feedbackForProduct.routes.js';
import instructionAboutDogRouter from './routes/instructionAboutDogs.routes.js';
import instructorRouter from './routes/instructor.routes.js';
import instructorAppointmentAtHomeRouter from './routes/intructorAppointmentAtHome.routes.js';
import partnerWithUsRouter from './routes/partnerWithUs.routes.js';
import productComplaintRouter from './routes/productComplaint.routes.js';
import puppyAdoptRouter from './routes/puppyAdopt.routes.js';
import userRouter from './routes/user.routes.js';
import strayDogRouter from './routes/strayDogLookAfter.routes.js';
import wantATrainedDogRouter from './routes/wantATrainedDog.routes.js';
import connectWithUsRouter from './routes/connectWithUs.routes.js'
import productRouter from './routes/product.routes.js';
import { setupSocket } from './ws/socket.js';

import helmet from 'helmet';
import sanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression'

import { createAdapter } from '@socket.io/redis-streams-adapter';
import redis from './config/redis.config.js';
import {instrument} from '@socket.io/admin-ui'
// // jobs import
// import './jobs/index.js'
import { connectKafkaProducer } from './config/kafka.js';
import { consumeMessages } from './helper/helper.js';

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:[ "http://localhost:5173", "https://admin.socket.io", "http://localhost:5174"],
    // methods: ["GET", "POST"],
    credentials: true
  },
  adapter:createAdapter(redis)
})

instrument(io, {
  auth: false,
  mode:"development"
})




setupSocket(io);
export{ io };


app.use(helmet());

app.use(express.json({ limit: '5kb' }));
app.use(sanitize());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ extended: true, limit: '5kb' }));
app.use(compression({
  level: 6,
  threshold: 10 * 1000,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));


const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 Hour
  max: 70, 
  message: "Too many accounts created from this IP, please try again after 1 Hour"
});

app.use(limiter)


dotenv.config();

app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true
}));


app.use(cookieParser());

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/instructor',instructorRouter);
app.use('/api/v1/appointmentWithDoctor',appointmentWithDoctorRouter);
app.use('/api/v1/dogAtCenter',dogAtCenterRouter);
app.use('/api/v1/dogBlog',dogBlogRouter);
app.use('/api/v1/dogCharacteristics',dogCharacteristicsRouter);
app.use('/api/v1/dogMate',dogMateRouter);
app.use('/api/v1/feedbackForProduct',feedbackForProductRouter);
app.use('/api/v1/instructionAboutDog',instructionAboutDogRouter);
app.use('/api/v1/feedbackForInstructor',feedbackForInstructorRouter);
app.use('/api/v1/instructorAppointmentAtHome',instructorAppointmentAtHomeRouter);
app.use('/api/v1/partnerWithUs',partnerWithUsRouter);
app.use('/api/v1/productComplaint',productComplaintRouter);
app.use('/api/v1/puppyAdopt',puppyAdoptRouter);
app.use('/api/v1/strayDog',strayDogRouter);
app.use('/api/v1/wantATrainedDog',wantATrainedDogRouter);
app.use('/api/v1/connect',connectWithUsRouter);
app.use('/api/v1/product',productRouter);


connectKafkaProducer().catch((error)=>{
  console.log('producer error',error);
})

consumeMessages(process.env.KAFKA_TOPIC).catch((err)=>{
  console.log('consumer error',err);
})


database();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log("server is running");
})


