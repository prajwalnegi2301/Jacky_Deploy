import mongoose from "mongoose";

const trainedDogSchema = new mongoose.Schema({
  purpose: {
    type: String,
    enum: [
      "GuardingFarmHouse",
      "ProtectionOfKids",
      "ArmyConfedential",
      "PoliceConfedential",
      "GuardingGrandParents",
      "ForGuardingSheeps",
      "PersonalProtection",
    ],
  },
  breed: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  name:{
    type:String,
  },
  age: {
    type: String,
  },
  color:{
    type: String,
  },
  description:{
    type: String,
  },
  weight:{
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
});

const trainedDog = mongoose.model("TrainedDog", trainedDogSchema);
export default trainedDog;
