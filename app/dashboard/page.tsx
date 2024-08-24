import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import LocationCard from './location-card';
import GuessWhoWillWin from './guess-who-will-win';

const Dashboard = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value as string;

  // Fetch all locations and their corresponding user ratings
  const locations = await prisma.location.findMany({
    include: {
      LocationRating: {
        where: { userId: userId },
        select: {
          beenThereBefore: true,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { guessWhoWillWin: true },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mt-4">
        <GuessWhoWillWin
          userId={userId}
          locations={locations.map((location) => ({
            id: location.id,
            name: location.name,
          }))}
          initialGuess={user?.guessWhoWillWin || null}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((location, index) => {
            const beenThereBefore = location.LocationRating.length
              ? location.LocationRating[0].beenThereBefore
              : false;

            return (
              <LocationCard
                key={location.id}
                location={location}
                index={index}
                userId={userId}
                initialBeenThereBefore={beenThereBefore}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
