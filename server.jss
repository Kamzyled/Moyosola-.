// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set this in Render
});
const openai = new OpenAIApi(configuration);

// Rooms storage
const rooms = {}; // { roomId: { players: {}, currentQuestion: '', currentAnswer: '' } }

// Serve React build
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Socket.IO for multiplayer
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create or join room
  socket.on('join-room', (roomId, playerName) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { players: {}, currentQuestion: '', currentAnswer: '' };
    }
    rooms[roomId].players[socket.id] = playerName;

    io.to(roomId).emit('room-update', Object.values(rooms[roomId].players));
  });

  // Player 1 requests a question
  socket.on('request-question', async (roomId) => {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a fun, romantic, playful love quiz question. Return ONLY the question text.`,
        max_tokens: 50,
      });
      const question = response.data.choices[0].text.trim();
      rooms[roomId].currentQuestion = question;
      io.to(roomId).emit('new-question', question);
    } catch (err) {
      console.error('OpenAI error:', err);
      io.to(roomId).emit('new-question', 'Oops! Could not generate question.');
    }
  });

  // Player 1 submits answer
  socket.on('submit-answer', (roomId, answer) => {
    rooms[roomId].currentAnswer = answer;
    io.to(roomId).emit('answer-submitted');
  });

  // Player 2 guesses
  socket.on('submit-guess', (roomId, guess) => {
    const correct = rooms[roomId].currentAnswer?.toLowerCase() === guess.toLowerCase();
    io.to(roomId).emit('guess-result', { guess, correct, answer: rooms[roomId].currentAnswer });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from rooms
    for (let roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];
        io.to(roomId).emit('room-update', Object.values(rooms[roomId].players));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
