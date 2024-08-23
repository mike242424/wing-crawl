const Star = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: React.MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={`w-10 h-10 cursor-pointer ${
      filled ? 'text-primary' : 'text-gray-300'
    }`}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927a.998.998 0 011.902 0l1.363 4.211h4.413c.742 0 1.052.915.455 1.37l-3.57 2.582 1.363 4.212c.216.667-.541 1.222-1.076.856L10 13.278l-3.47 2.88c-.534.366-1.292-.189-1.076-.856l1.363-4.212-3.57-2.582c-.597-.455-.287-1.37.455-1.37h4.413l1.363-4.211z" />
  </svg>
);

export default Star;
