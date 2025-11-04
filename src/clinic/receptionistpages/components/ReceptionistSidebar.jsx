import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, UserPlus, LogOut, List } from 'lucide-react';
import AuthService from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const ReceptionistSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 min-h-screen p-4 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Receptionist Panel</h2>
        <p className="text-blue-200 text-sm">Manage appointments & patients</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/receptionist-dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-blue-700'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/receptionist-patients" 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-blue-700'
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span>Patients</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/receptionist-appointments" 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-blue-700'
                }`
              }
            >
              <Calendar className="w-5 h-5" />
              <span>Book Appointment</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/receptionist-appointments-list" 
              className={({ isActive }) => 
                `flex items-center gap-3 py-3 px-4 rounded-lg transition ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'hover:bg-blue-700'
                }`
              }
            >
              <List className="w-5 h-5" />
              <span>Appointment List</span>
            </NavLink>
          </li>
          
          <li className="pt-4 mt-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition hover:bg-red-600 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ReceptionistSidebar;
