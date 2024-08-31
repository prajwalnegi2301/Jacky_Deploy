import mongoose from "mongoose";

const productComplaintSchema = new mongoose.Schema({

  productId: {
    type:Number,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productType:{
    type:String,
  },
  productName:{
    type:String,
  },
  isFoodItem: {
    type: String,
    enum: ["Yes", "No"],
  },
  isProductDefective: {
    type: String,
    enum: ["Yes", "No"],
  },
  isProductNotAsDescribed: {
    type: String,
    enum: ["Yes", "No"],
  },
  isProductNotReceived: {
    type: String,
    enum: ["Yes", "No"],
  },
  isOther: {
    type: String,
    enum:["Yes","No"],
  },
  desc: {
    type: String,
  },
  avatar:{
    public_id:String,
    url:String,
  }
});

const productComplaint = mongoose.model('ProductComplaint',productComplaintSchema);
export default productComplaint;
