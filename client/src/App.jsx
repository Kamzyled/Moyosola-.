import React, { useState } from 'react';
import io from 'socket.io-client';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';

const socket = io();

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);

  const handleJoin = (name, room) => {
    setPlayerName(name);
    setRoomId(room);
    socket.emit('join-room', room, name);
    setInRoom(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-indigo-500 text-white flex items-center justify-center">
      {!inRoom ? (
        <Welcome onJoin={handleJoin} />
      ) : (
        <Quiz socket={socket} playerName={playerName} roomId={roomId} />
      )}
    </div>
  );
}
