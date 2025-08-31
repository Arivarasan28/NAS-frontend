import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../../../services/AuthService';

const PatientSidebar = () => {
  const location = useLocation();
  const [patientName, setPatientName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    // Get patient ID from localStorage
    const userId = AuthService.getUserId();
    if (userId) {
      // For now just display User ID since we don't have a getName method
      setPatientName(`Patient #${userId}`);
      
      // Alternatively, we could fetch the patient name from an API endpoint
      // but we'll keep it simple for now
    }
  }, []);
  
  const navItems = [
    { 
      path: '/patient-dashboard', 
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/book-appointment', 
      label: 'Book Appointment',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      path: '/all-appointments', 
      label: 'My Appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      path: '/medical-records', 
      label: 'Medical Records',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      path: '/patient-profile', 
      label: 'My Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`bg-blue-800 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">Patient Portal</h2>
              {patientName && <p className="text-sm text-blue-200">Welcome, {patientName}</p>}
            </div>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-blue-700">
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition ${
                  location.pathname === item.path ? 'bg-blue-900' : ''
                }`}
              >
                <div className="mr-3">{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <button 
          onClick={() => AuthService.logout()}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2 w-full text-blue-200 hover:text-white hover:bg-blue-700 rounded transition`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;
