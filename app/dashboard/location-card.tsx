'use client';

import { useEffect, useState } from 'react';
import Star from './star';

const criteriaMap = {
  appearance: 'appearance',
  aroma: 'aroma',
  sauceQuantity: 'sauceQuantity',
  spiceLevel: 'spiceLevel',
  skinConsistency: 'skinConsistency',
  meat: 'meat',
  greasiness: 'greasiness',
  overallTaste: 'overallTaste',
} as const;

type Criteria = keyof typeof criteriaMap;

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
  const [ratings, setRatings] = useState<Record<Criteria, number>>({
    appearance: 0,
    aroma: 0,
    sauceQuantity: 0,
    spiceLevel: 0,
    skinConsistency: 0,
    meat: 0,
    greasiness: 0,
    overallTaste: 0,
  });

  useEffect(() => {
    const fetchRatings = async () => {
      const response = await fetch(
        `/api/rating?locationId=${location.id}&userId=${userId}`,
        {
          next: { revalidate: 0 },
        },
      );
      const data = await response.json();
      setRatings(data.ratings || ratings);
    };

    fetchRatings();
  }, [location.id, userId]);

  const handleRating = async (criterion: Criteria, newRating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterion]: newRating,
    }));
    await fetch('/api/rating', {
      next: { revalidate: 0 },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: location.id,
        userId: userId,
        criterion,
        rating: newRating,
      }),
    });
  };

  const criteria: { name: string; key: Criteria }[] = [
    { name: 'appearance (1 = ugly, 10 = beautiful)', key: 'appearance' },
    { name: "aroma (1 = poor, 10 = can't wait to eat)", key: 'aroma' },
    {
      name: 'sauce Quantity (1 = not enough/too much, 10 = just right)',
      key: 'sauceQuantity',
    },
    {
      name: 'spice Level (1 = too mild/too hot, 10 = on the money)',
      key: 'spiceLevel',
    },
    {
      name: 'skin Consistency (1 = too soggy/too crispy, 10 = perfection)',
      key: 'skinConsistency',
    },
    { name: 'meat (1 = overcooked/undercooked, 10 = juicy)', key: 'meat' },
    {
      name: "greasiness (1 = drippin', 10 = perfect amount)",
      key: 'greasiness',
    },
    {
      name: 'overall Taste (1 = poor, 10 = perfection)',
      key: 'overallTaste',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-2">
        {index + 1}. {location?.name}
      </h2>
      <p className="text-lg font-bold text-primary mb-4">{location.wing}</p>

      {criteria.map((criterion) => (
        <div key={criterion.key} className="mb-4">
          <h3 className="text-md font-medium capitalize">{criterion.name}</h3>
          <div className="flex">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                filled={i < ratings[criterion.key]}
                onClick={() => handleRating(criterion.key, i + 1)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationCard;
