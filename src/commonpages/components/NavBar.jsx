

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import axios from 'axios';
import AuthService from '../../services/AuthService';

const NavBar = ({ setIsAuthPopupsOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication status when component mounts or when localStorage changes
    const checkAuth = () => {
      const loggedIn = AuthService.isLoggedIn();
      const role = AuthService.getUserRole();
      const uid = AuthService.getUserId();
      setIsLoggedIn(loggedIn);
      setUserRole(role);

      if (loggedIn && uid) {
        // Ensure Authorization header is set for protected requests
        AuthService.setAuthHeader(AuthService.getToken());
        const cachedName = localStorage.getItem('userName');
        if (cachedName) {
          setUserName(cachedName);
        } else {
          // Fetch user's name and cache it
          axios.get(`http://localhost:8081/api/user/${uid}`)
            .then(res => {
              const name = res.data?.name || res.data?.username || '';
              if (name) {
                localStorage.setItem('userName', name);
                setUserName(name);
              }
            })
            .catch(() => {
              // Ignore name fetch errors; fallback to role label
            });
        }
      } else {
        setUserName('');
        localStorage.removeItem('userName');
      }
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
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };
  
  // Get dashboard URL and label based on user role
  const getDashboardUrl = () => {
    switch(userRole) {
      case 'ADMIN': return '/admin-dashboard';
      case 'DOCTOR': return '/doctor-dashboard';
      case 'RECEPTIONIST': return '/receptionist-dashboard';
      case 'PATIENT': return '/patient-profile';
      default: return '/';
    }
  };
  
  const getRoleLabel = () => {
    switch(userRole) {
      case 'ADMIN': return 'Admin';
      case 'DOCTOR': return 'Doctor';
      case 'RECEPTIONIST': return 'Receptionist';
      case 'PATIENT': return 'Patient';
      default: return 'User';
    }
  };

  const getDisplayName = () => {
    return userName || getRoleLabel();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/doctors" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                }`
              }
            >
              All Doctors
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{getDisplayName()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <NavLink
                      to={getDashboardUrl()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthPopupsOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/doctors"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                All Doctors
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                Contact
              </NavLink>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200 mt-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{getDisplayName()}</span>
                      </div>
                    </div>
                    <NavLink
                      to={getDashboardUrl()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthPopupsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
