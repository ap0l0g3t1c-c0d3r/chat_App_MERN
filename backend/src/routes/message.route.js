import express from "express"
import { protectRoute } from "../middleware/auth.middleWare.js"
import { getUserForSidebar, getMessages, sendMessages } from "../controller/message.controller.js"

const router = express.Router()

router.get("/users", protectRoute, getUserForSidebar) //to get all the users in the database for side
router.get("/:id", protectRoute, getMessages)     //to get all the messages btw A and B user

router.post("/send/:id", protectRoute, sendMessages)

export default router;