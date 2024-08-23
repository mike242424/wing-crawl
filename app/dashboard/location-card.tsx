'use client';

import { useEffect, useState } from 'react';
import Star from './star';

const LocationCard = ({
  location,
  index,
  userId,
}: {
  location: {
    id: string;
    name: string;
    wing: string;
  };
  index: number;
  userId: string;
}) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const response = await fetch(
        `/api/rating?locationId=${location.id}&userId=${userId}`,
        { cache: 'no-store' },
      );
      const data = await response.json();
      setRating(data.rating || 0);
    };

    fetchRating();
  }, [location.id, userId]);

  const handleRating = async (newRating: number) => {
    setRating(newRating);
    await fetch('/api/rating', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: location.id,
        rating: newRating,
        userId: userId,
      }),
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-2">
        {index + 1}. {location?.name}
      </h2>
      <p className="text-lg font-bold text-primary mb-4">{location.wing}</p>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            filled={i < rating}
            onClick={() => handleRating(i + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationCard;
