import mongoose from "mongoose";

const puppyAdoptSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  breed: {
    type: String,
  },
  mainImage: {
    public_id: String,
    url: String,
  },
  oneImage: {
    public_id: String,
    url: String,
  },
  twoImage: {
    public_id: String,
    url: String,
  },
  threeImage: {
    public_id: String,
    url: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },
  weight: {
    type: String,
  },
});

const puppyAdopt = mongoose.model("PuppyAdopt", puppyAdoptSchema);
export default puppyAdopt;
