import mongoose, { mongo } from "mongoose";

const instructorAppointmentAtHomeSchema = new mongoose.Schema({
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    duration:{
        type:String,
    },
    date:{
        type:String,
    },
    dogBreed:{
        type:String,
    },
    dogAge:{
        type:String,
    },
    dogBehaviour:{
        type:String,
        //kvjdbvfbvosbvu
    },
    docAvatar:{
        public_id:String,
        url:String,
    },
    address:{
        type:String,
    },//lhsoihsid
    purpose:{
        type:String,
        enum:["Grooming","Nails","Walk","TakeCareForAWhile","Training"],
    },
    //lcvn
    training:{
        type:String,
        enum:["BasicCommands","Searching","Guarding","ImprovingAthletics","TeachingMannersToHim"],
    },
    //lnid
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending",
    },
},{timestamps:true});

const instructorAppointmentAtHome = mongoose.model('InstructorAppointmentAtHome',instructorAppointmentAtHomeSchema);
export default instructorAppointmentAtHome;