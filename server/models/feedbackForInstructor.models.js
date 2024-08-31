import mongoose from "mongoose";

const feedbackForInstructorSchema = new mongoose.Schema({
    review:{
        type:String,
    },
    rating:{
        type:String,
        enum:["1","2","3","4","5"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    instructorName:{
        type:String,
    },
    instructorId:{
       type:String,
    },
});

const feedbackForInstructor = mongoose.model('FeedbackForInstructor',feedbackForInstructorSchema);

export default feedbackForInstructor;