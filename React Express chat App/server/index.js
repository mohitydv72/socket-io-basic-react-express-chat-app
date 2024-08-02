import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // For generating unique user IDs

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const users = {}; // To keep track of users and their IDs

io.on("connection", (socket) => {
  // Assign a unique ID to the connected user
  const userId = uuidv4();
  users[socket.id] = userId;
  console.log(`New client connected with ID: ${userId}`);

  socket.on("chat message", (message) => {
    console.log("Message received:", message);
    // Send message along with user ID
    io.emit("chat message", { message, userId: users[socket.id] });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with ID: ${users[socket.id]}`);
    delete users[socket.id];
  });
});

// Run the server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
