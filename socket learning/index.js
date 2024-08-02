//Packages
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname , join } from 'path';

// Instances
const app = express();
const server = http.createServer(app) ;
const io = new Server(server);

//serving HTML file
const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(__dirname);
//define connections and event handler
app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
})
io.on('connection' , (socket)=>{
    console.log('User Connected To server : ' , socket.id);
    socket.on('disconnect' ,()=>{
        console.log('User Disconnected : ' , socket.id);
    })
    // socket.emit('welcome',`hey ${socket.id} : you are getting data  from server`);
    socket.on('message',(msg)=>{
        console.log(msg);
    })
})
//start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});