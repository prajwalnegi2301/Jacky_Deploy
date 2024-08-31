import mongoose from "mongoose";

const feedbackForProductSchema = new mongoose.Schema({
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
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    },
});

const feedbackForProduct = mongoose.model('FeedbackForProduct',feedbackForProductSchema);

export default feedbackForProduct;