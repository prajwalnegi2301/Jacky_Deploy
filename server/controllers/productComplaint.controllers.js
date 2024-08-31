import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import ProductComplaint from "../models/product.models.js";


// create feedback
export const postProductComplaint = asyncErrorHandler(async (req, res, next) => {

  const user = req.user;
  const userId = user._id;
  
  const {productType,productName,isFoodItem, isProductDefective, isProductNotAsDescribed, productId, isProductNotReceived, isOther, desc } = req.body;

  if (!productType || !productId || !productName || !isFoodItem || !isProductDefective || !isProductNotAsDescribed || !isProductNotReceived || !desc || !isOther) {
    return next(new ErrorHandler("Please Fill All the Credentials", 400));
  }

  const newComplaint = new ProductComplaint({
    productType,productName,isFoodItem, isProductDefective, isProductNotAsDescribed, isProductNotReceived, isOther, desc, productId,
    user:userId

  });
  
  await newComplaint.save();

  res.status(200).json({ message: "Complaint listed", success: true, newComplaint });
});

export const getComplaints = asyncErrorHandler(async(req,res,next)=>{
  const complaints = ProductComplaint.find();
  if(!complaints){
    return next(new ErrorHandler("No Complaints Found",404));
  }
  res.status(200).json({message:"Complaints Found",success:true,
    complaints});
})




