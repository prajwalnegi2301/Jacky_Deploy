import { Queue, Worker } from 'bullmq';
import { defaultQueueConfig, redisConnection } from '../config/queue.js'
import User from '../models/user.models.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ErrorHandler from '../utils/errorMiddleware.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import cloudinary from 'cloudinary'

// // import { registerQueue } from '../controllers/user.controllers.js';


export const createAppointmentWithDoctorQueueName = 'create-appointment-with-doctor';




export const handler = new Worker(createAppointmentWithDoctorQueueName, async (job) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            docAvatar.tempFilePath
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponse.error || "Unknown Cloudinary Error"
            );
            return next(
                new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
            );
        }
        const appointment = new Appointment({
            timeApp,
            dateApp,
            desc,
            docAvatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
            user: userId,
        });
        await appointment.save();


    } catch (error) {
        console.error("Worker error:", error);
        throw error;
    }
}, { connection: redisConnection });


handler.on("completed", (job) => {
    console.log("create Appointment With Doctor work completed", job.id);
})

handler.on("failed", (job) => {
    console.log("create Appointment With Doctor work failed", job.id);
})



