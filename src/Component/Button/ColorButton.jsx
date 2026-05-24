import React from 'react'

const ColorButton = ({value}) => {
  return (
    <button className="border border-[#611F69] py-2 px-4 rounded-md bg-[#611F69] hover:bg-white text-white hover:text-[#611F69] cursor-pointer transition-all">
      {value}
    </button>
  );
}

export default ColorButton