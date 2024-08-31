import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import Feedback from "../models/feedbackForProduct.models.js";


// create feedback
export const postFeedbackForProduct = asyncErrorHandler(async (req, res, next) => {

  const user = req.user;
  const userId = user._id;
  const { id } = req.params;
  
  const {review, rating  } = req.body;

  if (!review || !rating ) {
    return next(new ErrorHandler("Please Fill All the Credentials", 400));
  }

  const newFeedback = new Feedback({
    review,
    rating,
    user:userId,
    product:id,
  });

  await newFeedback.save();

  res.status(200).json({ message: "Feedback listed", success: true, complaint });
});




// get All Feedbacks of a Product
export const getAllFeedbackOfParticularProduct = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
  const feedback = await Feedback.find({product:id});
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
    return next(new ErrorHandler("no feedbacks found", 404));
  }
  res.status(200).json({
    success: true,
    feedbacks,
  });
});


