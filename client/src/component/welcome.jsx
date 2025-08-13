import React, { useState } from 'react';

export default function Welcome({ onJoin }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center max-w-md w-full">
      <h1 className="text-5xl font-bold text-pink-400 mb-4">Moyosola</h1>
      <p className="mb-6 text-lg">Welcome to your personalized Love Quiz 💖</p>
      <input
        className="w-full mb-4 p-3 rounded-lg text-black"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-6 p-3 rounded-lg text-black"
        placeholder="Room Code (e.g., 1234)"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        className="bg-pink-500 hover:bg-pink-600 px-8 py-3 rounded-xl font-semibold text-white"
        onClick={() => onJoin(name || 'Player', room || '0000')}
      >
        Join Game
      </button>
    </div>
  );
        }
