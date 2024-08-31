import mongoose from "mongoose";

const dogBlogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description1: {
    type: String,
  },
  mainImage: {
    public_id: String,
    url: String,
  },
  description2: {
    type: String,
  },
  paraOneImage: {
    public_id: String,
    url: String,
  },
  description3: {
    type: String,
  },
  paraTwoImage: {
    public_id: String,
    url: String,
  },
  paraThreeImage: {
    public_id: String,
    url: String,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  authorName:{
    type:String,
  }

});

const dogBlog = mongoose.model('DogBlog', dogBlogSchema);
export default dogBlog;
