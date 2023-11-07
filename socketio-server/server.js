const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3002;
const uri = process.env.MURL || "localhost:27017";
const client = new MongoClient("mongodb://" + uri, { useNewUrlParser: true, useUnifiedTopology: true });

// adding cors
app.use(cors());

// Function to fetch today's leaders
async function fetchTodaysLeaders() {
  try {
    await client.connect();
    const database = client.db('leader');
    const collection = database.collection('leaders');

    // Get today's date at midnight
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Query for documents created today
    const query = { createdAt: { $gte: startOfToday } };
    const todaysLeaders = await collection.find(query).toArray();

    // Emit the data to all connected clients
    io.emit('updatePlayers', todaysLeaders);
  } catch (error) {
    console.error('Error fetching today\'s leaders:', error);
  } finally {
    await client.close();
  }
}

// Fetch and emit today's leaders data every second
setInterval(() => {
  fetchTodaysLeaders();
}, 1000);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
