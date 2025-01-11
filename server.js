const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Create an instance of Express
const app = express();

// Set the port
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
    io.to(room).emit('message', { username: 'System', message: `${username} has joined the room.` });
  });

  // Handle chat messages
  socket.on('chatMessage', ({ username, room, message }) => {
    io.to(room).emit('message', { username, message });
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

