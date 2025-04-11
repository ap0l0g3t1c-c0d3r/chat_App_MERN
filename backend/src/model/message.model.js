//we want the message to have sender Id, receiver id, time and either it should be a text or an image

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please provide the user to send the data to"],
            ref: "User",
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please provide the reciver name"],
            ref: "User",
        },
        text:{
            type: String,
        },
        image:{
            type: String,
        }

    }, {timestamps: true}
) 

const Message = mongoose.model("Message", messageSchema)

export default Message;