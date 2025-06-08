import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Manage your clinic</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/admin-dashboard" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-appointments" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-doctors" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Doctors
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-patients" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-register-user" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Register User
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
