import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import Instructions from "../models/instructionsAboutDogs.models.js";


// create feedback
export const postInstruction = asyncErrorHandler(async (req, res, next) => {

  
  const { title, description } = req.body;
  
  if (!title || !description) {
    return next(new ErrorHandler("Please Fill All the Credentials", 400));
  }

  const instruction = new Instructions({
    title,
    description,
    
  });

  await instruction.save();

  res.status(200).json({ message: "Instruction listed", success: true, instruction });
});




// Get All feedbacks
export const getAllInstructions = asyncErrorHandler(async (req, res, next) => {

  const instructions = await Instructions.find();
  if (!instructions) {
    return next(new ErrorHandler("no instructions found", 404));
  }
  res.status(200).json({
    success: true,
    instructions,
  });
});



// delete feedbacks
export const deleteInstruction = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    const instruction = await Instructions.findById(id);
    if (!instruction) {
      return next(new ErrorHandler("no instruction found", 404));
    }
    instruction.deleteOne();
    res.status(200).json({
      success: true,
      instruction,
    });
  });
  

