const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Create Express application and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the current directory (e.g. index.html)
app.use(express.static(__dirname));

// Serve the chat UI on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast chat messages to all connected clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Optional: handle user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Listen on the port provided by the environment (for hosting) or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
