'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith('session-token='),
    );

    if (sessionCookie) {
      setIsSignedUp(true);
    }
  }, []);

  return (
    <nav className="bg-primary py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-white text-xl">
          Charleston Wing Crawl 2024
        </Link>
        {isSignedUp && (
          <Link className="font-bold text-white" href="/results">
            Results
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
