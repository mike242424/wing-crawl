import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-white text-3xl tracking-wider">
          Wing Crawl 2024
        </Link>
        <Link className="font-bold text-white" href="/results">
          Results
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
