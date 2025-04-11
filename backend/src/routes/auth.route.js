import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controller/auth.contoller.js"
import { protectRoute } from "../middleware/auth.middleWare.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile) //to update the profile we will first check if they are authenticated

router.get("/check", protectRoute, checkAuth) //if the user refreshes the page then we would show the user if it is authenticated

export default router