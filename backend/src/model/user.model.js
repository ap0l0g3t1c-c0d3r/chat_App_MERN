import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    fullName: {
        type: String,
        required: [true, "Please provide us with a username"]
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    profilePic:{
        type: String,
        default: ""
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User