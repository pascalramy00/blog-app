import React from "react";
import Link from "next/link";
export const navLinks = [
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/editor-demo",
    label: "Demo",
  },
];

const Header = () => {
  return (
    <nav className="py-4 w-full bg-white flex justify-between items-center">
      <Link href="/">Home</Link>
      <ul className="flex justify-between">
        {navLinks.map(({ label, href }) => (
          <li key={href} className="ml-8">
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
