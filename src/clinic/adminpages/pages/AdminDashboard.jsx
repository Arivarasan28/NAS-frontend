import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Appointments</h2>
            <p className="text-gray-600 mb-4">Manage all appointments</p>
            <Link to="/admin-appointments" className="text-blue-500 hover:underline">View all appointments</Link>
          </div>
          
          {/* Doctors Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Doctors</h2>
            <p className="text-gray-600 mb-4">Manage doctors and their schedules</p>
            <Link to="/admin-doctors" className="text-green-500 hover:underline">View all doctors</Link>
          </div>
          
          {/* Patients Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Patients</h2>
            <p className="text-gray-600 mb-4">Manage patient records</p>
            <Link to="/admin-patients" className="text-purple-500 hover:underline">View all patients</Link>
          </div>
          
          {/* User Registration Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">User Registration</h2>
            <p className="text-gray-600 mb-4">Register new doctors, patients, and staff</p>
            <Link to="/admin-register-user" className="text-indigo-500 hover:underline">Register new user</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
