import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import Feedback from "../models/feedbackForInstructor.models.js";


// create feedback
export const postFeedback = asyncErrorHandler(async (req, res, next) => {

  const user = req.user;
  const userId = user._id;
  
  
  const {review, rating, instructorName, instructorId  } = req.body;

  if (!review || !rating || !instructorName || !instructorId) {
    return next(new ErrorHandler("Please Fill All the Credentials", 400));
  }

  const newFeedback = new Feedback({
    review,
    rating,
    instructorName,
    user:userId,
    instructorId,
  });
  
  await newFeedback.save();

  res.status(200).json({ message: "Feedback listed", success: true, complaint });
});




// get All Feedbacks of a instructor->
export const getAllFeedbackOfParticularInstructor = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
  const feedback = await Feedback.find({instructor:id});
  if (!feedback) {
    return next(new ErrorHandler("no feedbacks found", 404));
  }
  res.status(200).json({
    success: true,
    feedback
  });
});



// Get All feedbacks
export const getAllFeedBacks = asyncErrorHandler(async (req, res, next) => {

  const feedbacks = await Feedback.find();
  if (!feedbacks) {
    return next(new ErrorHandler("no feddbacks found", 404));
  }
  res.status(200).json({
    success: true,
    feedbacks,
  });
});


