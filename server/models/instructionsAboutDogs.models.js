import mongoose from "mongoose";

const instructionSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
});

const instruction = mongoose.model('Instruction',instructionSchema);

export default instruction;