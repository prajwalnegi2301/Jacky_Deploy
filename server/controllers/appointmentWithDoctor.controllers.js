import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import Appointment from "../models/appointmentWithDoctor.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
import { Queue, Worker } from 'bullmq'
// import {appointmentWithDoctorQueueName} from '../queue/appointmentQueue.js'


export const sendtestEmail = asyncErrorHandler(async (req, res, next) => {
  try {
    const emailJob = await emailQueue.add("send-email", {
      to: req.query,
      subject: req.body.subject,
      body: req.body.body,
    });

    res.status(200).json({ message: "Email job added", jobId: emailJob.id });
  } catch (error) {
    next(error);
  }
});



// export const createAppointmentWithDoctorQueue = new Queue(appointmentWithDoctorQueueName, {
//   connection: redisConnection,
//   defaultJobOptions: defaultQueueConfig
// });


// Create Appointment
export const createAppointment = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }
  const { timeApp, dateApp, desc } = req.body;
  if (!timeApp || !dateApp || !desc) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
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
  res.status(201).json({
    success: true,
    appointment
  })

})





// export const appointmentWithDoctorQueue = new Queue(appointmentWithDoctorQueueName, {
//   connection: redisConnection,
//   defaultJobOptions: defaultQueueConfig
// });

// QUEUE
export const getAllAppoinments = asyncErrorHandler(async (req, res, next) => {
  const appointments = await Appointment.find();
  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("no appointments found", 404));
  }
 
  //  const appointmentWithDoctorQueueJob = await appointmentWithDoctorQueue.add(appointmentWithDoctorQueueName,{});

  res.status(200).json({
    success: true,
    appointments,
  });
});


const emailQueueName = "email-queue";

const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig
});

// Workers
const handler = new Worker(emailQueueName, async (job) => {
  console.log(" the email worker data is", job.data);
},
  { connection: redisConnection }
);


// Worker listener

handler.on("completed", (job) => {
  console.log("Email worker completed", job.id);
})

handler.on("failed", (job) => {
  console.log("Email worker failed", job.id);
})





export const getAppointmentOfParticularUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const appointments = await Appointment.find({ user: id });
  if (!appointments) {
    return next(new ErrorHandler("no appointments found", 404));
  }
  res.status(200).json({
    success: true,
    appointments,
  });
});

// updating complaint Details
export const updateAppointmentStatus = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    let appointments = await Appointment.findById(id);
    if (!appointments) {
      return next(new ErrorHandler("no appointment found", 400));
    }
    appointments = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "appointment Status Updated",
      appointments,
    });
  }
);



