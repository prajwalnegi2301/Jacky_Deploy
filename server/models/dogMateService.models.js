import mongoose from "mongoose";

const dogMateSchema = new mongoose.Schema({
  dogName: {
    type: String,
  },
  dogBreed: {
    type: String,
  },
  dogAge: {
    type: String,
  },
  dogLocation: {
    type: String,
  },
  dogDescription: {
    type: String,
  },
  dogImage: {
    public_id: String,
    url: String,
  },
  dogWeight:{
    type:String,
  },
  dogColor:{
    type:String,
  },
  dogSize:{
    type:String,
  },
  dogGender: {
    type: String,
    enum: ["Male", "Female"],
  },
  dogNature: {
    type: String,
    enum: ["Friendly", "NotFriendly"],
  },
  animalAggression: {
    type: String,
    enum:["Yes","No"],
  },

});

const dogMate = mongoose.model('DogMate',dogMateSchema);
export default dogMate;