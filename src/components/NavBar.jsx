

import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ setIsAuthPopupsOpen }) => {
  return (
    <header className="sticky top-0 z-[1] mx-auto flex w-full max-w-7xl items-center justify-between border-b border-gray-200 bg-background p-[0em] font-sans font-medium uppercase text-text-primary backdrop-blur-[100px] dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary text-1xl">
      <div className="logo">
        <NavLink to="/" className="inline-block">
          <img src="/logo.png" alt="Logo" className="h-[80px] w-auto mr-3" />
        </NavLink>
      </div>

      <nav className="flex items-center justify-between w-full">
        <div className="flex space-x-7 mx-auto">
          <NavLink to="/" className="text-sm font-medium hover:text-blue-600 transition duration-300 focus:border-b-2">
            Home
          </NavLink>
          <NavLink to="/doctors" className="text-sm font-medium hover:text-blue-600 transition duration-300 focus:border-b-2">
            All Doctors
          </NavLink>
          <NavLink to="/about" className="text-sm font-medium hover:text-blue-600 transition duration-300 focus:border-b-2">
            About
          </NavLink>
          <NavLink to="/contact" className="text-sm font-medium hover:text-blue-600 transition duration-300 focus:border-b-2">
            Contact
          </NavLink>
        </div>

        <button
          onClick={() => setIsAuthPopupsOpen(true)}
          className="px-4 py-0 bg-customBlue2 text-white font-semibold rounded-lg hover:bg-customBlue1 transition duration-300"
        >
          Login
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
