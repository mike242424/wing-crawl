'use client';

import { useEffect, useState } from 'react';
import Star from '@/app/dashboard/star';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import Spinner from '@/components/spinner';


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
  initialBeenThereBefore,
  initialNotes,
}: {
  location: {
    id: string;
    name: string;
    wing: string;
  };
  index: number;
  userId: string;
  initialBeenThereBefore: boolean;
  initialNotes: string;
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

  const [beenThereBefore, setBeenThereBefore] = useState(initialBeenThereBefore);
  const [notes, setNotes] = useState(initialNotes || '');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/rating?locationId=${location.id}&userId=${userId}`,
          {
            next: { revalidate: 0 },
          },
        );
        const data = await response.json();

        if (data.ratings) {
          setRatings(data.ratings);
        }
        if (typeof data.beenThereBefore === 'boolean') {
          setBeenThereBefore(data.beenThereBefore);
        }
        if (data.notes) {
          setNotes(data.notes);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [location.id, userId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateNotes(notes);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [notes]);

  const updateNotes = async (debouncedNotes: string) => {
    try {
      setLoading(true);
      await fetch('/api/rating', {
        next: { revalidate: 0 },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: location.id,
          userId: userId,
          notes: debouncedNotes,
        }),
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (criterion: Criteria, newRating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterion]: newRating,
    }));
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Failed to update rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBeenThereBeforeChange = async (value: boolean) => {
    setBeenThereBefore(value);
    setLoading(true);
    try {
      await fetch('/api/rating', {
        next: { revalidate: 0 },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: location.id,
          userId: userId,
          beenThereBefore: value,
        }),
      });
    } catch (error) {
      console.error('Failed to update "been there before" status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
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
    <div className="bg-white p-6 rounded-lg shadow-2xl hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-2">
        {index + 1}. {location?.name}
      </h2>
      <p className="text-lg font-bold text-primary mb-4">{location.wing}</p>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
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

          <div className="mb-4">
            <h3 className="text-md font-medium mb-1">Been Here Before:</h3>
            <div className="flex items-center">
              <label className="mr-4 flex items-center space-x-2">
                <Checkbox
                  checked={beenThereBefore === true}
                  onCheckedChange={() => handleBeenThereBeforeChange(true)}
                  className="me-1"
                />
                Yes
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={beenThereBefore === false}
                  onCheckedChange={() => handleBeenThereBeforeChange(false)}
                  className="me-1"
                />
                No
              </label>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Notes:</h3>
            <Textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Dipping Sauces/Etc."
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LocationCard;
