const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the file we just made
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");       // Import this
const messageRoutes = require("./routes/messageRoutes"); // Import this

// 1. Load Environment Variables

dotenv.config();
connectDB(); // Call the function to connect

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middlewares (The Gatekeepers)
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow backend to parse JSON data sent from frontend
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);       // Add this
app.use("/api/message", messageRoutes); // Add this

// 4. Basic Test Route
app.get("/", (req, res) => {
  res.send("API is Running Successfully 🚀");
});

// 5. Start Server
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // URL of your Frontend
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // 1. Setup: User joins their own personal room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // 2. Join Chat: User joins a specific chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // 3. New Message: Server receives message and sends to others
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      // Don't send it back to the sender
      if (user._id == newMessageRecieved.sender._id) return;

      // Send to the user's personal room
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });
});