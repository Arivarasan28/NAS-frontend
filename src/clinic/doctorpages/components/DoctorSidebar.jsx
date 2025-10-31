import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaCalendarPlus, FaUmbrellaBeach } from 'react-icons/fa';

const DoctorSidebar = () => {
  return (
    <div className="w-64 bg-blue-800 text-white min-h-screen p-4">
      <div className="text-2xl font-bold mb-8 text-center">Doctor Portal</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/doctor-dashboard"
              className="flex items-center p-3 text-white hover:bg-blue-700 rounded"
            >
              <FaUserMd className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/doctor-appointments"
              className="flex items-center p-3 text-white hover:bg-blue-700 rounded"
            >
              <FaCalendarAlt className="mr-3" />
              Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/doctor-slots"
              className="flex items-center p-3 text-white hover:bg-blue-700 rounded"
            >
              <FaCalendarPlus className="mr-3" />
              Create Slots
            </Link>
          </li>
          <li>
            <Link
              to="/doctor-profile"
              className="flex items-center p-3 text-white hover:bg-blue-700 rounded"
            >
              <FaClipboardList className="mr-3" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/doctor-leave-management"
              className="flex items-center p-3 text-white hover:bg-blue-700 rounded"
            >
              <FaUmbrellaBeach className="mr-3" />
              Leave Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DoctorSidebar;
