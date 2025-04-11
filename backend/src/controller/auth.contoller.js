import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../model/user.model.js"
import bcryptjs from "bcryptjs"

export const signup = async (req,res) => {
    const { fullName, email, password} = req.body
    
    try {
        if(!email || !fullName || !password){
           return res.status(400).send("Please share email, fullname, password")
        }
        //hashing the passwords
        if(password.length < 8){
           return res.status(400).send("Password should be more than 8 characters")
        }
        const user = await User.findOne({email})
        // console.log(user)
        if(user){
           return res.status(404).json({message: "Email already exists, Kindly Use a new Email"})
        }
        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(password,salt)
        
        const newUser = new User({fullName, email, password: hashedPassword})
        // console.log(newUser)

        if(newUser){
            //created jwt token 
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(200).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                // password: hashedPassword,
                profilePic: newUser.profilePic
            })

        }else{
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup Controller", error.message)
        res.status(500).json({message: "Internal Server Error on SignUp Route"})
    }    
}

export const login = async (req,res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
           return res.status(400).json({message: "Invalid email or password"})
        }
        const user = await User.findOne({email})
        // console.log(user)
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        generateToken(user._id, res)
        res.status(200).json({ 
            id: user._id, 
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in Login Controller", error.message)
        res.status(500).json({message: "Internal Server Error on Login Route"})
    }
}

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out Succesfully"})
    } catch (error) {
        console.log("Error in Logout Route: ", error.message)
        res.status(500).json({"message": "Internal Server Error"})
    }
    
}

export const updateProfile = async (req,res) => {
    try {
        const { profilePic } = req.body
        // console.log(req.user)
        const userID = req.user._id
        // console.log(userID)

        if(!profilePic){
            return res.status(400).json({message : "Please provide profile picture"})
        }

        const uploadResponce = await cloudinary.uploader.upload(profilePic)
        // console.log("Upload responce", uploadResponce)

        const updatedUser = await User.findByIdAndUpdate(userID, {profilePic: uploadResponce.secure_url}, {new: true})
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("error in update Profile", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
    
}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkauth controller", error.message);
        res.status(500).send({message: "Internal Server Error"})
    }
}