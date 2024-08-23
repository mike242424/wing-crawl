'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

const Results = () => {
  const [locations, setLocations] = useState<
    { id: string; name: string; wing: string; averageScore: number }[]
  >([]);

  const handleClick = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchAverageRatings = async () => {
      try {
        const response = await fetch('/api/results', { cache: 'no-store' });
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Location
                </TableHead>
                <TableHead className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Wing
                </TableHead>
                <TableHead className="py-2 px-2 sm:px-4 bg-primary text-white font-bold text-left text-sm sm:text-base">
                  Average Score
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id} className="hover:bg-gray-200">
                  <TableCell className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.name}
                  </TableCell>
                  <TableCell className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.wing}
                  </TableCell>
                  <TableCell className="py-4 px-2 sm:px-4 border-t border-gray-300 text-sm font-bold sm:text-base">
                    {location.averageScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Results;
