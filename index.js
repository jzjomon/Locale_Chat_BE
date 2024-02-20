import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/auth.js'
import mongoose from 'mongoose';
import users from './routes/users.js'
import { Server } from 'socket.io';
import CHAT from "./models/chat.js"
import USER from './models/user.js'


const app = express();
dotenv.config();

const __dirname = path.dirname(import.meta.url);
const __filename = path.basename(import.meta.url);

mongoose.connect(process.env.MONGOURL).then(() => {
    console.log("Mongodb connection established");
}).catch(() => {
    console.log("Mongodb connection error");
})

app.use(express.json());
app.use(cors());

app.use("/", auth);
app.use("/users", users)

const expressServer = app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: process.env.CLIENT_URL
    }
})

let onlineUsers = []

io.on("connection", (socket) => {
    socket.on("addUserId", async (id) => {
        onlineUsers.push({ userId: id, socketId: socket.id });
        await USER.findOneAndUpdate({ _id : id }, { lastOnline : "online" });;
        io.emit("getOnline", id);
        // console.log(onlineUsers);
        // console.log("added user");
    });
    io.emit("onlineUsers", onlineUsers);
    
    socket.on("sendMessage", async (data) => {
        const userOnline = onlineUsers.find(user => user.userId === data.userId);
        const message = { sender: data.sender, text: data.text }
        if (userOnline) {
            await CHAT.findOneAndUpdate({
                $and: [{ users: { $elemMatch: { $eq: data.sender } } },
                { users: { $elemMatch: { $eq: data.userId } } }
                ]
            }, { lastMessage: data.text })
            io.to([userOnline.socketId, socket.id]).emit("message", message);
        } else { 
            await CHAT.findOneAndUpdate({
                $and: [{ users: { $elemMatch: { $eq: data.sender } } },
                    { users: { $elemMatch: { $eq: data.userId } } }
                ]
            }, { lastmessage: data.text});
            socket.emit("message", message);
        }
    })
    
    socket.on("disconnect", async (id) => {
        let currentUser = onlineUsers.filter(users => users.socketId === socket.id);
        if (currentUser.length > 0) await USER.findOneAndUpdate({ _id : currentUser[0].userId }, { lastOnline : new Date().toLocaleTimeString() })
        socket.broadcast.emit("getLastOnline")
        onlineUsers = onlineUsers.filter((users) => users.socketId !== socket.id);

        
        // console.log("removed user");
        // console.log(onlineUsers);
        socket.broadcast.emit("onlineUsers", onlineUsers);
    })

})
