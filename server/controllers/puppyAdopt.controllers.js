import ErrorHandler from "../utils/errorMiddleware.js";
import Puppy from "../models/puppyAdopt.models.js";
import cloudinary from "cloudinary";
import catchAsyncError from "../utils/asyncErrorHandler.js";



// POST Puppy details->
export const puppyPost = catchAsyncError(async (req, res, next) => {
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
    name,
    breed,
    age,
    gender,
    description,
    color,
    weight,
  } = req.body;


  if (!name || !breed || !age || !gender || !color || !weight || !description) {
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
  const puppyData = {
    name,breed,age,color,weight,description,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };
  if (oneImageRes) {
    puppyData.oneImage = {
      public_id: oneImageRes.public_id,
      url: oneImageRes.secure_url,
    };
  }
  if (twoImageRes) {
    puppyData.twoImage = {
      public_id: twoImageRes.public_id,
      url: twoImageRes.secure_url,
    };
  }
  if (threeImageRes) {
    puppyData.threeImage = {
      public_id: threeImageRes.public_id,
      url: threeImageRes.secure_url,
    };
  }
  const puppy = await Puppy.create(puppyData);
  res.status(200).json({
    success: true,
    message: "Puppy details Uploaded!",
    puppy,
  });
});



// DELETE Puppy->
export const deletePuppy = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const puppy = await Puppy.findById(id);
    if(!puppy){
        return next(new ErrorHandler("puppy deleted",404));
    }
    await puppy.deleteOne();

    res.status(200).json({message:"puppy deleted",success:true})


})



// GET ALL Puppies ->
export const getAllPuppies = catchAsyncError(async(req,res,next)=>{
    const puppies = await Puppy.find();
    res.status(200).json({
        puppies,
        success:true
    })
})


// GET Particular Puppies ->
export const getParticularPuppies = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params;
  const puppy = await Puppy.findById(id);
  res.status(200).json({
      puppy,
      success:true
  })
})




