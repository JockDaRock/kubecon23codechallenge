const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const PORT = 3002;

// adding cors
app.use(cors());

//mock data
let totalAvatars = 10;
let assignRandomAvatar = () => Math.floor(Math.random() * totalAvatars) + 1;

let players = [
    { id: 1, name: 'Clifford James', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 2, name: 'Edgar Soto', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 3, name: 'Nevaeh Silva', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 4, name: 'Clayton Watson', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 5, name: 'Debbie Lane', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 6, name: 'Gabriella Steward', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 7, name: 'Nina Perkins', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 8, name: 'Dennis Henry', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 9, name: 'Courtney Fuller', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 10, name: 'Joan Wood', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 11, name: 'Isaac Mitchell', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 12, name: 'Natalie Reyes', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 13, name: 'Harold Ford', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 14, name: 'Bethany Lane', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 15, name: 'Leonardo Garcia', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 16, name: 'Samantha Paul', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 17, name: 'Oliver Lee', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 18, name: 'Katherine Brooks', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 19, name: 'Jordan Bell', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 20, name: 'Bianca Hall', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 21, name: 'Julian Torres', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 22, name: 'Alyssa Rogers', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 23, name: 'Ethan Gomez', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 24, name: 'Vivian Knight', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    { id: 25, name: 'Benjamin Hughes', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
    // Add other players here
];

// Sort players based on completion time (ascending order)
players.sort((a, b) => a.completionTime - b.completionTime);

setInterval(() => {
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    players[randomPlayerIndex].completionTime += Math.floor(Math.random() * 60); // adding a random number of seconds, up to a minute
    
    // Sort players based on completion time (ascending order)
    players.sort((a, b) => a.completionTime - b.completionTime);
    
    io.emit('updatePlayers', players);
}, 1000);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('updatePlayers', players);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
