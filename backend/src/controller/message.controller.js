import User from "../model/user.model.js"
import Message from "../model/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getRecieverSocketID, io } from "../lib/socket.js"

//fetch everyuse except ourselvs
export const getUserForSidebar = async(req,res) => {
    try {
        const loggedInId = req.user._id
        if(!loggedInId){
            return res.status(400).json({"message": "Invalid Id"})
        }
        const filteredUsers = await User.find({_id:{$ne:loggedInId}}).select("-password")
        // console.log("Message Route get Users",filteredUsers)
        res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log("Error in message controller Router:", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getMessages = async (req,res) => {
    try {
        const { id: friendsId } = req.params
        const myId = req.user._id
        const message = await Message.find({
            $or:
            [   
               { senderId: myId , receiverId: friendsId},       //if the message sender is us and reciver is a friend 
               { senderId: friendsId, receiverId: myId}         //if a friend is the sender and we are the reciver
            ]
        })
        res.status(200).json(message)

    } catch (error) {
        console.log("Error in getMessage controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessages = async (req,res) => {
    try {
        const { text, image } = req.body
        const { id: friendsId } = req.params
        const myId = req.user._id
        // console.log("From Backend", text, image)
        let imageUrl;

        if(image){
            //upload base64 image to cloudinary
            const uploadResponce = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponce.secure_url
        }
        if( !myId ){
            return res.status(404).json({message: "Not authorised to send message"})
        }
        if( !friendsId){
            return res.status(400).json({message: "Please select a receiver"})
        }

        // console.log("Image in send message messageRoute",imageUrl)

        const newMessage = new Message({ senderId: myId, receiverId: friendsId, text , image: imageUrl} )
        await newMessage.save()

        //todo realtime functionality for socket.io
        const receiverId = getRecieverSocketID(friendsId)
        // if reciever is online since then only we can get the socketID
        // to get the socketId so we can share the messages in real time 
        if(receiverId){
            io.to(receiverId).emit( "newMessage", newMessage)
        }
        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in the sendMessage controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
}