import React, { useEffect, useState } from 'react';

export default function Quiz({ socket, playerName, roomId }) {
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    socket.on('room-update', setPlayers);
    socket.on('new-question', setQuestion);
    socket.on('answer-submitted', () => setQuestion(question));
    socket.on('guess-result', setResult);
    return () => socket.off();
  }, [socket, question]);

  const requestQuestion = () => socket.emit('request-question', roomId);
  const submitAnswer = () => socket.emit('submit-answer', roomId, answer);
  const submitGuess = () => socket.emit('submit-guess', roomId, guess);

  return (
    <div className="max-w-lg w-full p-6 bg-white/10 backdrop-blur-xl rounded-3xl text-center">
      <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
      <p className="mb-2">Players in room: {players.join(', ')}</p>

      {!question ? (
        <button onClick={requestQuestion} className="px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600">
          Generate Question
        </button>
      ) : !answer ? (
        <div>
          <h3 className="text-xl mb-2">{question}</h3>
          <input
            placeholder="Your Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="p-2 rounded-md text-black mb-2"
          />
          <button onClick={submitAnswer} className="px-6 py-2 bg-pink-500 rounded-xl hover:bg-pink-600">
            Submit Answer
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl mb-2">Guess Player 1's Answer!</h3>
          <input
            placeholder="Your Guess"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="p-2 rounded-md text-black mb-2"
          />
          <button onClick={submitGuess} className="px-6 py-2 bg-green-500 rounded-xl hover:bg-green-600">
            Submit Guess
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-white/20 rounded-xl">
          <p>
            Your Guess: {result.guess} — {result.correct ? '✅ Correct!' : '❌ Wrong!'}
          </p>
          {!result.correct && <p>Correct Answer: {result.answer}</p>}
        </div>
      )}
    </div>
  );
}
