//Packages
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

// Instances
const app = express();
const server = http.createServer(app) ;
const io = new Server(server);

app.use(express.static('public'));

io.on('connection' , (socket)=>{
    console.log('New user connected' , socket.id);
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
      });
      socket.on("disconnect", () => {
        console.log("User Disconnected ❌");
      });
})
//start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});