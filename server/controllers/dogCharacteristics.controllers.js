import DogCharacteristics from "../models/dogCharacteristics.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
//add info about dog->
export const dogCharacteristicsPost = asyncErrorHandler(
  async (req, res, next) => {
    const { image1Avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowedFormats.includes(image1Avatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const {
      breed,
      size,
      coat,
      temperament,
      energyLevel,
      exerciseNeeds,
      trainingNeeds,
      nature,
      animalAggression,
    } = req.body;
    if (
      !breed ||
      !size ||
      !coat ||
      !temperament ||
      !energyLevel ||
      !exerciseNeeds ||
      !trainingNeeds ||
      !nature ||
      !animalAggression
    ) {
      return next(new ErrorHandler("Fill the credentials", 400));
      
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image1Avatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Avatar To Cloudinary", 500)
      );
    }
    const dogCharacteristics = await DogCharacteristics.create({
      breed,
      size,
      coat,
      temperament,
      energyLevel,
      exerciseNeeds,
      trainingNeeds,
      nature,
      animalAggression,
      image1Avatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      message: "Dog Characteristics added successfully",
      dogCharacteristics,
    });
  }
);

// get info about dog->
export const dogCharacteristicsGet = asyncErrorHandler(
  async (req, res, next) => {
    const { breed } = req.params;
    const dogCharacteristics = await DogCharacteristics.find({ breed: breed });
    if (!dogCharacteristics) {
      return next(new ErrorHandler("No dog characteristics found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Dog Characteristics fetched successfully",
      dogCharacteristics,
    });
  }
);

// update dog characteristics->
export const updateDogCharacteristics = asyncErrorHandler(
  async (req, res, next) => {
    const { breed } = req.params;
    const findDogWithGivenBreed = await DogCharacteristics.find({
      breed: breed,
    });
    if (!findDogWithGivenBreed) {
      return next(new ErrorHandler("No dog characteristics found", 404));
    }
    const dogCharacteristics = await DogCharacteristics.findOneAndUpdate(
      breed,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Dog Characteristics updated successfully",
      dogCharacteristics,
    });
  }
);

// get all dogs characteristics->
export const getAllDogCharacteristics = asyncErrorHandler(
  async (req, res, next) => {
    const dogCharacteristics = await DogCharacteristics.find();
    if (!dogCharacteristics) {
      return next(new ErrorHandler("No dog characteristics found", 404));
    }
    res.status(200).json({
      success: true,
      message: "All dog characteristics fetched successfully",
      dogCharacteristics,
    });
  }
);

// delete dog characteristics
export const deleteDogCharacteristics = asyncErrorHandler(
  async (req, res, next) => {
    const { breed } = req.params;
    const findDogWithGivenBreed = await DogCharacteristics.find({
      breed: breed,
    });
    if (!findDogWithGivenBreed) {
      return next(new ErrorHandler("No dog characteristics found", 404));
    }
    const dogCharacteristics = await DogCharacteristics.findOneAndDelete({
      breed: breed,
    });

    res.status(200).json({
      success: true,
      message: "Dog characteristics deleted successfully",
    });
  }
);
