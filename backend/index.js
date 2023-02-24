const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 4000;

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// WebSocket connection
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join a room with a unique ID
  socket.on("join-room", (roomId) => {
    console.log(`Client ${socket.id} joining room ${roomId}`);
    socket.join(roomId);

    // Broadcast a message to all users in the room
    socket.on("send-message", (message) => {
      console.log(`Received message: ${message}`);
      io.to(roomId).emit("receive-message", message);
    });

    // Save uploaded file to disk and broadcast file URL to all users in the room
    socket.on("upload-file", (file) => {
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = path.join(__dirname, "uploads", fileName);

      fs.writeFile(filePath, file.data, (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
          socket.emit("file-upload-failure", err);
        } else {
          console.log(`File saved to: ${filePath}`);
          const fileUrl = `/uploads/${fileName}`;
          io.to(roomId).emit("file-upload-success", { fileName, fileUrl });
        }
      });
    });
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
