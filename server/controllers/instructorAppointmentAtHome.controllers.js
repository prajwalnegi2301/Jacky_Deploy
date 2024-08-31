import InstructorAppointmentAtHome from "../models/instructorAppointmentAtHome.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";

// create instructorAtHome appointment
export const createInstructorAppointmentAtHome = asyncErrorHandler(
  async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    const user = req.user;
    const userId = user._id;
    const {
      instructor,
      duration,
      date,
      dogBreed,
      dogAge,
      dogBehaviour,
      address,
      purpose,
      training,
    } = req.body;
    if (
      !instructor ||
      !duration ||
      !date ||
      !dogBreed ||
      !dogAge ||
      !dogBehaviour ||
      !address ||
      !purpose
    ) {
      return next(new ErrorHandler("Fill all the credentials", 400));
    }
    if (training === "") {
      training = null;
    }
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
      );
    }
    const appointment = new InstructorAppointmentAtHome({
      instructor,
      duration,
      date,
      dogBreed,
      dogAge,
      dogBehaviour,
      address,
      purpose,
      training,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    appointment.status = "Pending";
    appointment.createdBy = userId;
    await appointment.save();
    res.status(200).json({ message: "appointment created", success: true });
  }
);

// get All AppointmentsForHome->
export const getAllAppointmentsForHomeVisit = asyncErrorHandler(
  async (req, res, next) => {
    const appointments = await InstructorAppointmentAtHome.find().populate(
      //instructor field of each document
      "instructor",
      // data from instructor collection
      "name email"
    );
    if (!appointments) {
      return next(new ErrorHandler("No appointments found", 404));
    }
    res.status(200).json({ appointments, success: true });
  }
);

// get appointments for a particular instructor->
export const getInstructorAppointmentsForHomeVisit = asyncErrorHandler(
  async (req, res, next) => {
    const instructorId = req.params.instructorId;
    const appointments = await InstructorAppointmentAtHome.find({
      instructor: instructorId,
    }).populate("instructor", "name email");
    if (!appointments) {
      return next(
        new ErrorHandler("No appointments found for this instructor", 404)
      );
    }
    res.status(200).json({ appointments, success: true });
  }
);

// update appointment with Accepted, Rejected or Pending
export const updateAppointmentStatus = asyncErrorHandler(
  async (req, res, next) => {
    const appointmentId = req.params.appointmentId;
    const { status } = req.body;
    const appointment = await InstructorAppointmentAtHome.findByIdAndUpdate(
      appointmentId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }
    res.status(200).json({ appointment, success: true });
  }
);

// delete appointment by user->
export const deleteAppointment = asyncErrorHandler(async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  const appointment = await InstructorAppointmentAtHome.findById(
    appointmentId
  );
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  
  appointment.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Appointment deleted successfully",appointment });
});
