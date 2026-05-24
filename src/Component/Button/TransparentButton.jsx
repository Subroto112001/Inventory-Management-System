import React from 'react'

const TransparentButton = ({value}) => {
  return (
    <button className="border border-[#611F69] text-[#611F69] py-2 px-4 rounded-md bg-transparent hover:bg-[#611F69] hover:text-white cursor-pointer transition-all">
      {value}
    </button>
  );
}

export default TransparentButton