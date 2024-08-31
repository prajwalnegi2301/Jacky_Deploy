import DogMateService from "../models/dogMateService.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'

// create dogMate service->
export const dogMatePost = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("dogImage Required!", 400));
  }
  const { dogImage } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  if (!allowedFormats.includes(dogImage.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }
  const {
    dogName,
    dogBreed,
    dogDescription,
    dogWeight,
    dogAge,
    dogLocation,
    dogColor,
    dogSize,
    dogGender,
    dogNature,
    animalAggression,
  } = req.body;
  if (
    !dogName ||
    !dogBreed ||
    !dogSize ||
    !dogGender ||
    !dogNature ||
    !dogDescription ||
    !dogWeight ||
    !dogAge ||
    !dogLocation ||
    !dogColor ||
    !animalAggression
  ) {
    return next(new ErrorHandler("Enter all the fields", 400));
    
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    dogImage.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor dogImage To Cloudinary", 500)
    );
  }
  const dogMateService = await DogMateService.create({
    dogName,
    dogBreed,
    dogDescription,
    dogWeight,
    dogAge,
    dogLocation,
    dogColor,
    dogSize,
    dogGender,
    dogNature,
    animalAggression,
    dogImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Dog Mate Service created successfully",
    dogMateService,
  });
});

//delete Post
export const deleteDogMateService = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const dogMateService = await DogMateService.findByIdAndRemove(id);
  res
    .status(200)
    .json({ success: true, message: "Post deleted", dogMateService });
});

// get particular dog By breed->
export const getDogByBreed = asyncErrorHandler(async (req, res, next) => {
  const { breed } = req.params;
  const dogMateService = await DogMateService.find({ dogBreed: breed });
  if (!dogMateService) {
    return next(new ErrorHandler(`No dog found with breed ${breed}`, 404));
  }
  res.status(200).json({ success: true, message: "Post..", dogMateService });
});

//get all dogs for mating->
export const getAllDogsForMating = asyncErrorHandler(async (req, res, next) => {
  const dogMate = await DogMateService.find();
  if (!dogMate) {
    return next(new ErrorHandler("No dogs found for mating", 404));
  }
  res.status(200).json({ success: true, message: "Posts..", dogMate });
});
