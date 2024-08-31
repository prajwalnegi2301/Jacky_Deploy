import mongoose from 'mongoose';


const appointmentSchema = new mongoose.Schema({
    timeApp:{
        type:String,
        enum:["10-11","11-12","12-1","3-4","4-5","5-6","6-7","7-8"],
    },
    dateApp:{
        type:String,
    },

    desc:{
        type:String,
    },
    status:{
        type:String,
        enum:["Accepted","Pending","Rejected"],
        default:"Pending",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
},
{timestamps:true});

const appointment = mongoose.model('Appointment',appointmentSchema);
export default appointment;