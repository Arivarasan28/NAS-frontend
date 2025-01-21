import React from "react";
import { NavLink } from "react-router-dom";
import { FaCalendarCheck, FaUserMd, FaListAlt, FaTachometerAlt } from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="h-screen w-64 bg-gray-50 shadow-md text-gray-700">
      <div className="py-6 text-center font-semibold text-lg border-b">
        Dashboard
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/appointments"
              className="flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-200 transition"
              activeClassName="bg-purple-100 border-r-4 border-purple-500"
            >
              <FaCalendarCheck className="mr-3 text-gray-600" />
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-doctor"
              className="flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-200 transition"
              activeClassName="bg-purple-100 border-r-4 border-purple-500"
            >
              <FaUserMd className="mr-3 text-gray-600" />
              Add Doctor
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctors-list"
              className="flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-200 transition"
              activeClassName="bg-purple-100 border-r-4 border-purple-500"
            >
              <FaListAlt className="mr-3 text-gray-600" />
              Doctors List
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
