const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create the app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the 'public' directory

// When a user connects
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle joining a room
    socket.on('joinRoom', ({ username, room }) => {
        // Join the room
        socket.join(room);

        // Send a welcome message to the joining user
        socket.emit('receiveMessage', { username: 'System', message: `Welcome to the room: ${room}` });

        // Notify all other users in the room about the new user
        socket.to(room).emit('receiveMessage', { username: 'System', message: `${username} has joined the room.` });
    });

    // Handle sending messages
    socket.on('sendMessage', ({ room, username, message }) => {
        // Broadcast the message to all users in the room
        io.to(room).emit('receiveMessage', { username, message });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
