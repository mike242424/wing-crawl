import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import LocationCard from './location-card';

const Dashboard = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value as string;

  const locations = await prisma.location.findMany({});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations?.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              index={index}
              userId={userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
