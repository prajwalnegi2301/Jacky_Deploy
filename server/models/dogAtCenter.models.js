import mongoose from "mongoose";

const dogStayAtCenterSchema = new mongoose.Schema({
  dogName: {
    type: String,
  },
  dogBreed: {
    type: String,
  },
  dogGender: {
    type:String,
    enum: ["Male", "Female"],
  },
  dogAge: {
    type: String,
  },
  dogWeight: {
    type: String,
  },
  animalAggression: {
    type: String,
    enum: ["Yes", "No"],
  },
  dogNature:{
    type: String,
    enum:["Friendly","Barks","Bites"],
  },
  dogStayDuration:{
    type:String,
    enum:["1Hours-1,000","2Hours-2,000","4Hours-4,000","6Hours-5,000","10Hours-8,000","12Hours-10,000","16Hours-12,000","20Hours-15,000","1Day-20,000","2Days-24,000","3Days-26,000","4Days-28,000","5Days-29,000","6Days-30,000","1week-32,000","1.5weeks-34,000","2weeks-38,000","2.5weeks-40,000"],
  },
  date:{
    type:String,
  },
  charges:{
    type:String,
  },
  docAvatar:{
    public_id:String,
    url:String,
  },
  status:{
    type:String,
    enum:["Accepted","Pending","Rejected"],
},
});

const dogStayAtCenter = mongoose.model('DogStayAtCenter',dogStayAtCenterSchema);
export default dogStayAtCenter;
