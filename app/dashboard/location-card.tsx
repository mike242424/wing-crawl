'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Star from '@/app/dashboard/star';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();
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

  const [beenThereBefore, setBeenThereBefore] = useState(
    initialBeenThereBefore,
  );
  const [notes, setNotes] = useState(initialNotes || '');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRating = (criterion: Criteria, newRating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterion]: prevRatings[criterion] === newRating ? 0 : newRating,
    }));
  };

  const handleBeenThereBeforeChange = (value: boolean) => {
    setBeenThereBefore(value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
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
          ratings: ratings,
          beenThereBefore: beenThereBefore,
          notes: notes,
        }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to submit data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const criteria: { name: string; key: Criteria }[] = [
    { name: 'appearance (0 = ugly, 10 = beautiful)', key: 'appearance' },
    { name: "aroma (0 = poor, 10 = can't wait to eat)", key: 'aroma' },
    {
      name: 'sauce Quantity (0 = not enough/too much, 10 = just right)',
      key: 'sauceQuantity',
    },
    {
      name: 'spice Level (0 = too mild/too hot, 10 = on the money)',
      key: 'spiceLevel',
    },
    {
      name: 'skin Consistency (0 = too soggy/too crispy, 10 = perfection)',
      key: 'skinConsistency',
    },
    { name: 'meat (0 = undercooked/overcooked, 10 = juicy)', key: 'meat' },
    {
      name: "greasiness (0 = drippin', 10 = perfect amount)",
      key: 'greasiness',
    },
    {
      name: 'overall Taste (0 = poor, 10 = perfection)',
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
              <h3 className="text-md font-medium capitalize">
                {criterion.name}
              </h3>
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
          <Button
            onClick={handleSubmit}
            className="mt-2 w-full bg-primary text-white"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </>
      )}
    </div>
  );
};

export default LocationCard;
