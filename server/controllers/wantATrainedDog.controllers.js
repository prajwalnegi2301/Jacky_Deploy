import ErrorHandler from "../utils/errorMiddleware.js";
import TrainedDog from "../models/wantATrainedDog.models.js";
import cloudinary from "cloudinary";
import catchAsyncError from "../utils/asyncErrorHandler.js";



// POST Dog details->
export const trainedDogPost = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler(" Main Image Is Mandatory!", 400));
  }
  const { mainImage, oneImage, twoImage, threeImage } = req.files;
  if (!mainImage) {
    return next(new ErrorHandler("Main Image Is Mandatory!", 400));
  }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (
    !allowedFormats.includes(mainImage.mimetype) ||
    (oneImage && !allowedFormats.includes(oneImage.mimetype)) ||
    (twoImage && !allowedFormats.includes(twoImage.mimetype)) ||
    (threeImage && !allowedFormats.includes(threeImage.mimetype))
  ) {
    return next(
      new ErrorHandler(
        "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
        400
      )
    );
  }
  const {
    purpose,
    name,
    breed,
    age,
    gender,
    description,
    color,
    weight,
  } = req.body;


  if (!name || !purpose || !breed || !age || !gender || !color || !weight || !description) {
    return next(
      new ErrorHandler("Enter Required Fields!", 400)
    );
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    oneImage
      ? cloudinary.uploader.upload(oneImage.tempFilePath)
      : Promise.resolve(null),
    twoImage
      ? cloudinary.uploader.upload(twoImage.tempFilePath)
      : Promise.resolve(null),
    threeImage
      ? cloudinary.uploader.upload(threeImage.tempFilePath)
      : Promise.resolve(null),
  ];
  const [mainImageRes, oneImageRes, twoImageRes, threeImageRes] =
    await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (oneImage && (!oneImageRes || oneImageRes.error)) ||
    (twoImage && (!twoImageRes || twoImageRes.error)) ||
    (threeImage && (!threeImageRes || threeImageRes.error))
  ) {
    return next(
      new ErrorHandler("Error occured while uploading one or more images!", 500)
    );
  }
  const dogData = {
    name,breed,age,color,weight,description,age,purpose,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };
  if (oneImageRes) {
    dogData.oneImage = {
      public_id: oneImageRes.public_id,
      url: oneImageRes.secure_url,
    };
  }
  if (twoImageRes) {
    dogData.twoImage = {
      public_id: twoImageRes.public_id,
      url: twoImageRes.secure_url,
    };
  }
  if (threeImageRes) {
    dogData.threeImage = {
      public_id: threeImageRes.public_id,
      url: threeImageRes.secure_url,
    };
  }
  const trainedDog = await TrainedDog.create(dogData);
  res.status(200).json({
    success: true,
    message: "Dog details Uploaded!",
    trainedDog
  });
});



// DELETE Dog->
export const deleteTrainedDog = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const trainedDog = await TrainedDog.findById(id);
    if(!trainedDog){
        return next(new ErrorHandler("trainedDog deleted",404));
    }
    await trainedDog.deleteOne();

    res.status(200).json({message:"trainedDog deleted",success:true})


})



// GET ALL Dog ->
export const getAllTrainedDog = catchAsyncError(async(req,res,next)=>{
    const trainedDog = await TrainedDog.find();
    res.status(200).json({
        trainedDog,
        success:true
    })
})



