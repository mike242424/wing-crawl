'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Results = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<
    { id: string; name: string; wing: string; averageScore: number }[]
  >([]);

  const handleClick = () => {
    router.refresh();
  };

  useEffect(() => {
    const fetchAverageRatings = async () => {
      try {
        const response = await fetch('/api/results');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching average ratings:', error);
      }
    };

    fetchAverageRatings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto mt-6 sm:mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold sm:mb-6">Results</h1>
          <Button className="hover:bg-secondary" onClick={handleClick}>
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Location
                </th>
                <th className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Wing
                </th>
                <th className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Average Score
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.name}
                  </td>
                  <td className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.wing}
                  </td>
                  <td className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.averageScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
