const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const pool=require("./config/db");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const authRoutes=require("./routes/authRoute.js");
const roomRoutes=require("./routes/roomRoutes.js");
const messageRoutes=require("./routes/messageRoutes.js");
const { disconnect } = require("cluster");
pool.connect()
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log("error connecting to database", err);
    });

const app=express();
const server=http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("join-room",(roomId)=>{
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    })
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })
})
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("io",io); //make io accessible to express routes
app.use("/api",authRoutes,roomRoutes,messageRoutes);
server.listen(3000,()=>{
    console.log("server running");
})