

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const NavBar = ({ setIsAuthPopupsOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication status when component mounts or when localStorage changes
    const checkAuth = () => {
      setIsLoggedIn(AuthService.isLoggedIn());
      setUserRole(AuthService.getUserRole());
    };
    
    // Check initial auth state
    checkAuth();
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same tab
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
    
    // Dispatch custom event to notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
  };
  
  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    switch(userRole) {
      case 'ADMIN': return '/admin-dashboard';
      case 'DOCTOR': return '/doctor-dashboard';
      case 'RECEPTIONIST': return '/receptionist-dashboard';
      case 'PATIENT': return '/patient-profile';
      default: return '/';
    }
  };
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

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <NavLink 
              to={getDashboardUrl()}
              className="text-sm font-medium hover:text-blue-600 transition duration-300"
            >
              Dashboard
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-0 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthPopupsOpen(true)}
            className="px-4 py-0 bg-customBlue2 text-white font-semibold rounded-lg hover:bg-customBlue1 transition duration-300"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
