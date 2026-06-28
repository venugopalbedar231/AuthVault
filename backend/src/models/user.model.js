import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: [true, "Username must be unique"]
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    }
});

const userModel = mongoose.model("user", userSchema)
export default userModel;