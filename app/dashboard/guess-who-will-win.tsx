'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GuessWhoWillWinProps } from '@/types/GuessWhoWillWinType';
import Spinner from '@/components/spinner';
import ConfirmationModal from '@/components/confirmationModal';

const GuessWhoWillWin = ({
  userId,
  locations,
  initialGuess,
}: GuessWhoWillWinProps) => {
  const router = useRouter();
  const [guess, setGuess] = useState<string | null>(initialGuess || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleGuess = async () => {
    if (guess || loading || !selectedLocation) return;
    setLoading(true);

    try {
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, guessWhoWillWin: selectedLocation.id }),
      });

      if (res.ok) {
        setGuess(selectedLocation.id);
        router.refresh();
      } else {
        console.error('Error saving guess.');
      }
    } catch (error) {
      console.error('Error saving guess.', error);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const handleClickLocation = (locationId: string, locationName: string) => {
    setSelectedLocation({ id: locationId, name: locationName });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow-2xl mb-6">
      <h3 className="text-xl font-semibold mb-4">Guess Who Will Win</h3>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <button
              key={location.id}
              className={`px-4 py-2 rounded ${
                guess === location.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-200/80 text-black'
              }`}
              onClick={() => handleClickLocation(location.id, location.name)}
              disabled={!!guess}
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
      {guess && (
        <div className="mt-4 text-center">
          <p>
            You guessed that{' '}
            <strong>{locations.find((loc) => loc.id === guess)?.name}</strong>{' '}
            will win.
          </p>
        </div>
      )}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleGuess}
        locationName={selectedLocation?.name || ''}
      />
    </div>
  );
};

export default GuessWhoWillWin;
