import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
      minLength: [3, "Name must contain atleast 3 characters"],
      validate:[validator.isAlphanumeric, "Do not use specailCharacters"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Others"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phone: {
      type: String,
      required: [true, "Enter Phone Number"],
      minLength: [10, "Phone Number must be 10 digit"],
      validate: {
        validator: (v) => validator.isMobilePhone(v, 'any'),
        message: "Enter a valid phone number"
      },
    },
    email: {
      type: String,
      validate:[validator.isEmail, "Enter a vaid email"],
      unique:true,
    },
    password: {
      type: String,
      minLength: [8, "Password must be atleast 8 characters"],
      validate:[validator.isStrongPassword, "ENter a strong Password"],
      select: false, // Hide password by default
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Instructor","Doctor"],
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
