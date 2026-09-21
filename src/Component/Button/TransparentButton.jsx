import Link from 'next/link';
import React from 'react'

const TransparentButton = ({ value, path }) => {
  return (
    <Link
      className="border border-[#611F69] text-[#611F69] py-2 px-4 rounded-md bg-transparent hover:bg-[#611F69] hover:text-white cursor-pointer transition-all"
      href={path}
    >
      {value}
    </Link>
  );
};

export default TransparentButton