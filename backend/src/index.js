import express from "express"
import "dotenv/config.js"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cookieparser from "cookie-parser"
import cors from "cors"
import { app, server} from "./lib/socket.js"
import path from "path" //needed for absolue path

const port = process.env.PORT || 3000
const _dirname = path.resolve() //getting the absolute path

app.use(express.json({ limit: "50mb"}))
app.use(cookieparser()) //allows you to parse the cookie
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRouter)
app.use("/api/message", messageRouter)

//if production change static folder to dist(where the react app is compiled)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname, "../frontend/chatApp/dist")))

    //if the client takes any route we want to serve the compiled files entry point for react application
    app.get("*", (req,res)=> {
        res.sendFile(path.join(_dirname, "../frontend", "chatApp" ,"dist", "index.html" ))
    })
}

server.listen(port, ()=> {
    connectDB()
    console.log(`Application is listening on port ${port}`)
})
