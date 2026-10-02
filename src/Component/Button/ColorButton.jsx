import React from "react";

const ColorButton = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border border-[var(--theme-primary)] py-2 px-4 rounded-md bg-[var(--theme-primary)] hover:bg-[var(--theme-surface)] text-[var(--theme-primary-text)] hover:text-[var(--theme-primary)] cursor-pointer transition-all"
    >
      {value}
    </button>
  );
};

export default ColorButton;
