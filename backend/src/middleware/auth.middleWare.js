import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        // console.log(req.cookies)
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({"message": "Unauthorized No token Provided"})
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedToken){
            return res.status(401).json({"message":"Unauthorized invalid Token"})
        }
        // console.log(decodedToken)
        const user = await User.findOne({_id : decodedToken.userID}).select("-password")
        // console.log("User from DB",user)

        if(!user){
            return res.status(404).json({message: "User not Found"})
        }
        req.user = user
        next()

    } catch (error) {
        console.log("Error in protect Route", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}