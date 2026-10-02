import Link from "next/link";
import React from "react";

const buttonClassName =
  "border border-[var(--theme-primary)] text-[var(--theme-primary)] py-2 px-4 rounded-md bg-transparent hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-text)] cursor-pointer transition-all";

const TransparentButton = ({ value, path, href, onClick, type = "button" }) => {
  const destination = href ?? path;

  if (destination) {
    return (
      <Link className={buttonClassName} href={destination}>
        {value}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} onClick={onClick} type={type}>
      {value}
    </button>
  );
};

export default TransparentButton;
