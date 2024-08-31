import mongoose from "mongoose";

const dogCharacteristicsSchema = new mongoose.Schema({
  coat: {
    type: String,
  },
  size: {
    type: String,
  },
  temperament: {
    type: String,
  },
  breed: {
    type: String,
  },
  energyLevel: {
    type: String,
  },
  exerciseNeeds: {
    type: String,
  },
  trainingNeeds: {
    type: String,
  },
  nature:{
    type:String,
    enum:["FriendlyWithEveryone","NotFriendlyWithOtherDogs"],
  },
  animalAggression:{
    type:String,
    enum:["Yes","Not","NotMuch"],
  },
  image1Avatar:{
    public_id:String,
    url:String,
  },
});

const dogCharacteristics = mongoose.model('DogCharacteristics',dogCharacteristicsSchema);

export default dogCharacteristics;
