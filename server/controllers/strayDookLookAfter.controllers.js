import StrayDog from "../models/strayDogLookAfter.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
// create stryDog LookAfterPost->
export const createStrayDogLookAfter = asyncErrorHandler(
  async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Avatar Required!", 400));
    }
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const user = req.user;
    const userId = user._id;
    const { dogColor, dogGender, dogDesc, dogBehaviour, address } = req.body;
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath
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
    const dog = await StrayDog.create({
      dogColor,
      dogGender,
      dogDesc,
      dogBehaviour,
      address,
      user: userId,
      avatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      dog,
    });
  }
);

// get all strayDogLookAfterPost->
export const getAllStrayDogLookAfter = asyncErrorHandler(
  async (req, res, next) => {
    const strayDog = await StrayDog.find();
    if(!strayDog){
        return next(new ErrorHandler("No Stray Dogs",400));
    }
    res.status(200).json({
      success: true,
      strayDog,
    });
  }
);
