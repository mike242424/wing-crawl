'use client';

import { GuessWhoWillWinProps } from '@/types/GuessWhoWillWinType';
import { useState } from 'react';

const GuessWhoWillWin = ({
  userId,
  locations,
  initialGuess,
}: GuessWhoWillWinProps) => {
  const [guess, setGuess] = useState<string | null>(initialGuess || null);

  const handleGuess = async (locationId: string) => {
    if (guess) return;

    try {
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, guessWhoWillWin: locationId }),
      });

      if (res.ok) {
        setGuess(locationId);
      } else {
        console.error('Error saving guess.');
      }
    } catch (error) {
      console.error('Error saving guess.', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Guess Who Will Win</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <button
            key={location.id}
            className={`px-4 py-2 rounded ${
              guess === location.id
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => handleGuess(location.id)}
            disabled={!!guess}
          >
            {location.name}
          </button>
        ))}
      </div>
      {guess && (
        <div className="mt-4 text-center">
          <p>
            You guessed that{' '}
            <strong>{locations.find((loc) => loc.id === guess)?.name}</strong>{' '}
            will win.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuessWhoWillWin;
