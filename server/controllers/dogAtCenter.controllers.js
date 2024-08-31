import Service from "../models/dogAtCenter.models.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
// post service
export const registerForDogStayAtCenter = asyncErrorHandler(async (req, res, next) => {
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
     
    const { dogName, dogBreed, dogGender, dogAge, dogWeight, animalAggression, dogNature,  dogStayDuration, date } = req.body;

    if( !dogName || !dogBreed || !dogGender || !dogAge || !dogWeight || !animalAggression || !dogNature || !dogStayDuration || !date ){
        return next(new ErrorHandler("All fields are required", 400));
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
    
    const service = new Service({ dogName, dogBreed, dogGender, dogAge, dogWeight, animalAggression, dogNature,  dogStayDuration, date,docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      }, });
      await service.save();
    res.status(201).json({ success: true, service });
})

// haircut:{
//     type:String,
//     cost: "150",
// },
// shave:{
//     type:String,
//     cost: "100",
// },
// haircolor:{
//     type:String,
//     cost: "200",
// },
// hairstraightening:{
//     type:String,
//     cost:"300",
// },
// massage:{
//     type:String,
//     cost:"500",
// },
// hairTreatment:{
//     type:String,
//     cost:"400",
// },

export const getAllUsersWithDogAtCenter = asyncErrorHandler(async(req,res,next)=>{
    const appointments = await Service.find();
    if(!appointments){
        return next(new ErrorHandler("No services found",404));
    }
    res.status(200).json({success:true,appointments});
})

// delete Service
export const deleteService = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const service = await Service.findById(id);
    if(!service){
        return next(new ErrorHandler("Service not found",404));
    }
    service.deleteOne();
    res.status(200).json({success:true,message:"Service deleted successfully"});
})


export const updateAppointmentStatus = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    let appointments = await Service.findById(id);
    if (!appointments) {
      return next(new ErrorHandler("no appointment found", 400));
    }
    appointments = await Service.findByIdAndUpdate(id, req.body, {
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
