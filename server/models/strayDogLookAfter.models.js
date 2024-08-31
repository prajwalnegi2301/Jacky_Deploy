import mongoose from "mongoose";

const strayDogSchema = new mongoose.Schema({
  avatar: {
    public_id: String,
    url: String,
  },
  dogColor: {
    type: String,
  },
  dogGender: {
    type: String,
    enum:["Male","Female"],
  },
  dogDesc: {
    type: String,
  },
  dogBehaviour: {
    type: String,
  },
  address: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const strayDog = mongoose.model("StrayDog", strayDogSchema);
export default strayDog;
